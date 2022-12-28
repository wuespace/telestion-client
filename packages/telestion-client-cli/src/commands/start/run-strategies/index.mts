import { StartOptions } from '../model.mjs';
import { RunStrategy } from './run-strategy.mjs';
import { ElectronRun } from './electron-run.mjs';
import { BrowserRun } from './browser-run.mjs';
import { FrontendServe } from './frontend-serve.mjs';

export * from './run-strategy.mjs';
export * from './frontend-serve.mjs';
export * from './browser-run.mjs';
export * from './electron-run.mjs';

/**
 * Finds the correct run strategy for the given options.
 * @param projectDir - the project directory
 * @param options - the run options
 */
export function findRunStrategy(
	projectDir: string,
	options: StartOptions
): RunStrategy {
	if (!options.open) return new FrontendServe(projectDir, options);

	if (options.target === 'electron')
		return new ElectronRun(projectDir, options);

	if (options.target === 'browser') return new BrowserRun(projectDir, options);

	throw new Error(`Unknown target: ${options.target}`);
}
