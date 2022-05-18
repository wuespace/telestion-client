import { ChildProcess } from 'node:child_process';
import inquirer from 'inquirer';

import { BaseWithPartial } from '../../model/index.mjs';
import { getLogger } from '../../lib/index.mjs';
import { getPackageJson, getPSCRoot } from '../../actions/psc.mjs';
import { clearNativeDependencies } from '../../actions/electron.mjs';

import { defaultStartOptions, StartOptions } from './model.mjs';
import {
	launchBrowser,
	launchElectron,
	parcelServeFrontendStage,
	parcelWatchElectronStage
} from './stages.mjs';

const logger = getLogger('Start');

/**
 * The actual command.
 * @param options - the complete options set
 */
export async function runStartCommand(
	options: StartOptions
): Promise<unknown[]> {
	const errors: unknown[] = [];
	logger.debug('Received options:', options);

	const projectDir = await getPSCRoot(options.workingDir);
	const packageJson = await getPackageJson(projectDir);

	// 1 - Start Parcel in "serve" mode for frontend target
	await parcelServeFrontendStage(projectDir, options, async stopServe => {
		switch (options.target) {
			case 'browser': {
				logger.debug('Running browser target');
				// 2a - launcher external browser
				return launchBrowser(projectDir, options);
			}
			case 'electron': {
				logger.debug('Running Electron target');

				try {
					let previousProcess: ChildProcess;
					// 2b - Start Parcel electron target and launch Electron
					await clearNativeDependencies(projectDir);
					await parcelWatchElectronStage(
						projectDir,
						options,
						async stopWatch => {
							previousProcess = await launchElectron(
								projectDir,
								options,
								packageJson,
								previousProcess,
								stopWatch
							);
						}
					);
					stopServe();
				} catch (err) {
					stopServe();
					throw err;
				}
				break;
			}
			default:
				throw new Error(`Unknown target: ${options.target}`);
		}
	});

	return errors;
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
