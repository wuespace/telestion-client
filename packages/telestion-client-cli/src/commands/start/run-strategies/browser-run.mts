import { RunStrategy } from './run-strategy.mjs';
import { getLogger, openUrl } from '../../../lib/index.mjs';
import { StartOptions } from '../model.mjs';
import { FrontendServe } from './frontend-serve.mjs';

/**
 * A run strategy that starts and opens the Telestion Client in a browser.
 *
 * Handles serving the frontend using the {@link FrontendServe} strategy.
 */
export class BrowserRun implements RunStrategy {
	private readonly logger = getLogger('Browser Run Strategy');
	private readonly frontendServe: FrontendServe;
	constructor(
		private readonly projectDir: string,
		private readonly options: StartOptions
	) {
		this.frontendServe = new FrontendServe(projectDir, options);
	}

	async run() {
		this.logger.debug('Start Browser Run Strategy');
		await this.frontendServe.run();
		this.logger.debug('Open browser');
		await openUrl(
			new URL(`http://localhost:${await this.frontendServe.port}/`)
		);
	}

	async stop(signal?: NodeJS.Signals) {
		this.logger.debug('Stop Browser Run Strategy');
		await this.frontendServe.stop(signal);
	}
}
