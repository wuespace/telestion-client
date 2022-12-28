import { RunStrategy } from './run-strategy.mjs';
import { StartOptions } from '../model.mjs';
import { serve } from '../../../actions/parcel.mjs';
import { ChildProcess, EventEmitter, getLogger } from '../../../lib/index.mjs';
import { BuildEvent } from '../../../model/index.mjs';

/**
 * Serve the frontend with Parcel.
 */
export class FrontendServe implements RunStrategy {
	public readonly port: Promise<number>;
	private updatePort?: (port: number) => void;

	private readonly logger = getLogger('Parcel Run Strategy');
	private childProcess?: ChildProcess;
	private alreadyBuilt: boolean = false;

	constructor(
		private readonly projectDir: string,
		private readonly options: StartOptions
	) {
		this.port = new Promise(resolve => (this.updatePort = resolve));
	}

	async run() {
		this.logger.debug('Start Parcel serve for frontend target');
		this.alreadyBuilt = false;

		return new Promise<void>(resolve => {
			this.childProcess = serve(
				this.projectDir,
				{ port: this.options.port, targets: ['frontend'] },
				event => {
					this.handleBuildEvent(event, resolve);
				}
			);
		});
	}

	async stop(signal?: NodeJS.Signals) {
		this.logger.debug('Stop Parcel serve for frontend target');
		if (!this.childProcess) return;
		this.childProcess?.stop(signal);
	}

	/**
	 * Calls the `resolve` function if the frontend has been successfully built for
	 * the first time in the strategy's execution.
	 * @param event - the build event
	 * @param resolve - the resolve function
	 * @private
	 */
	private handleBuildEvent(
		event: BuildEvent,
		resolve: (value: PromiseLike<void> | void) => void
	) {
		this.logger.debug('New build event in frontend serve received:', event);

		// skip non-build success events
		if (event.type !== 'buildSuccess') return;

		// multiple call prevention
		if (this.alreadyBuilt) return;
		this.alreadyBuilt = true;

		this.updatePort?.(this.options.port);
		resolve();
	}

	connect(eventEmitter: EventEmitter) {
		if (!this.childProcess) return;

		eventEmitter.connect(this.childProcess);
	}
}
