import inquirer from 'inquirer';

import { BaseWithPartial } from '../../model/index.mjs';
import { getLogger } from '../../lib/index.mjs';
import { getPSCRoot } from '../../actions/psc.mjs';
import { defaultStartOptions, StartOptions } from './model.mjs';
import { findRunStrategy, RunStrategy } from './run-strategies/index.mjs';

const logger = getLogger('Start');

/**
 * The actual command.
 * @param options - the complete options set
 */
export async function runStartCommand(
	options: StartOptions
): Promise<RunStrategy> {
	logger.debug('Received options:', options);

	const projectDir = await getPSCRoot(options.workingDir);
	const runStrategy = await findRunStrategy(projectDir, options);
	await runStrategy.run();
	registerInterrupts(runStrategy, ['SIGINT', 'SIGTERM', 'SIGHUP']);

	return runStrategy;
}

function registerInterrupts(
	runStrategy: RunStrategy,
	interrupts: NodeJS.Signals[]
): void {
	for (const interrupt of interrupts) {
		process.on(interrupt, () => {
			logger.debug(`Main process received '${interrupt}'. Emit stop event`);
			runStrategy.stop(interrupt).finally();
		});
	}
}

/**
 * Asks the user some questions on some missing parts in the current options set.
 * @param options - the current options set (does not have to be complete)
 */
export async function hydrateStartOptions(
	options: BaseWithPartial<StartOptions>
): Promise<StartOptions> {
	return inquirer.prompt<StartOptions>(
		[
			{
				type: 'list',
				name: 'target',
				message: 'Select the output target:',
				choices: ['electron', 'browser'],
				default: defaultStartOptions.target
			},
			{
				type: 'number',
				name: 'port',
				message: 'Port number on which the dev server should hear on:',
				default: defaultStartOptions.port
			},
			{
				type: 'confirm',
				name: 'open',
				message: 'Open the browser after the dev server has started?',
				default: defaultStartOptions.open
			}
		],
		options
	);
}
