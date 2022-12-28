import { RunStrategy } from './run-strategy.mjs';
import { ChildProcess, EventEmitter, getLogger } from '../../../lib/index.mjs';
import { StartOptions } from '../model.mjs';
import { FrontendServe } from './frontend-serve.mjs';
import {
	clearNativeDependencies,
	generateDistPackageJson,
	installNativeDependencies,
	startElectron
} from '../../../actions/electron.mjs';
import { getPackageJson } from '../../../actions/psc.mjs';
import { watch } from '../../../actions/parcel.mjs';

/**
 * A run strategy that starts and opens the Telestion Client in Electron.
 *
 * Handles serving the frontend using the {@link FrontendServe} strategy.
 */
export class ElectronRun implements RunStrategy {
	private readonly logger = getLogger('Electron Run Strategy');
	private readonly frontendServe: FrontendServe;
	private readonly eventEmitter: EventEmitter;
	private electronProcess?: () => ChildProcess;
	private readonly packageJsonPromise: Promise<Record<string, unknown>>;

	constructor(
		private readonly projectDir: string,
		private readonly options: StartOptions
	) {
		this.frontendServe = new FrontendServe(projectDir, options);
		this.packageJsonPromise = getPackageJson(projectDir);
		this.eventEmitter = new EventEmitter();
	}

	async run() {
		this.logger.debug('Start Electron Run Strategy');
		await this.frontendServe.run();

		await clearNativeDependencies(this.projectDir);

		this.runElectron(this.projectDir);
		this.frontendServe.connect(this.eventEmitter);
	}

	async stop(signal?: NodeJS.Signals) {
		this.logger.debug('Stop Electron Run Strategy');
		await this.frontendServe.stop(signal);

		// stop Electron
		this.eventEmitter.stop(signal);
	}

	/**
	 * Runs the Electron app.
	 *
	 * Uses `parcel watch` to build the `main` process and restarts the app on
	 * changes.
	 * @param projectDir - the project directory
	 * @private
	 */
	private runElectron(projectDir: string) {
		this.logger.debug('Start Parcel watch for electron target');

		this.eventEmitter.connect(
			watch(
				projectDir,
				// disable hot module replacement because it adds a random date to imports
				{ targets: ['electron'], additionalArgs: ['--no-hmr'] },
				event => event.type === 'buildSuccess' && this.restartElectronApp()
			)
		);
	}

	/**
	 * Restarts the Electron app and connects it to {@link eventEmitter}.
	 *
	 * If the app is not running, it will be started.
	 * @private
	 */
	private async restartElectronApp() {
		this.electronProcess?.().stop();
		const nativeDependencies = await generateDistPackageJson(
			this.projectDir,
			await this.packageJsonPromise
		);
		await installNativeDependencies(this.projectDir, nativeDependencies);
		const electronProcess = startElectron(this.projectDir, this.options.port);
		this.electronProcess = this.eventEmitter.connect(electronProcess);
	}
}
