import { ChildProcess } from 'node:child_process';
import inquirer from 'inquirer';

import { BaseWithPartial } from '../../model/index.mjs';
import { getLogger, openUrl } from '../../lib/index.mjs';
import { getPackageJson, getPSCRoot } from '../../actions/psc.mjs';
import {
	clearNativeDependencies,
	startElectron
} from '../../actions/electron.mjs';

import { defaultStartOptions, StartOptions } from './model.mjs';
import {
	parcelServeFrontendStage,
	parcelWatchElectronStage,
	prepareElectronEnvironment
} from './stages.mjs';

const logger = getLogger('Start');

/**
 * The actual command.
 * @param options - the complete options set
 */
export async function runStartCommand(options: StartOptions): Promise<void> {
	logger.debug('Received options:', options);

	const projectDir = await getPSCRoot(options.workingDir);
	const packageJson = await getPackageJson(projectDir);

	const parcelFrontedProcess = parcelServeFrontendStage(
		projectDir,
		options,
		parcelFrontedProcess => {
			switch (options.target) {
				case 'browser': {
					logger.debug('Running browser target');
					// 2a - launcher external browser
					if (options.open) {
						openUrl(new URL(`http://localhost:${options.port}/`));
					}
					break;
				}
				case 'electron': {
					logger.debug('Running Electron target');

					clearNativeDependencies(projectDir).then(() => {
						let electronProcess: ChildProcess | undefined;
						const parcelElectronProcess = parcelWatchElectronStage(
							projectDir,
							options,
							parcelElectronProcess => {
								// cleanup old Electron process
								electronProcess?.removeAllListeners('exit');
								electronProcess?.kill();

								// start new Electron process
								prepareElectronEnvironment(projectDir, packageJson).then(() => {
									electronProcess = startElectron(projectDir, options.port);
									// kill parcel electron process once Electron process exits
									electronProcess.on('exit', () => {
										logger.debug(
											'Electron process dead. Kill Parcel Electron process'
										);
										parcelElectronProcess.kill();
									});
								});
							}
						);

						// kill parcel frontend process when parcel electron exits
						parcelElectronProcess.on('exit', () => {
							logger.debug(
								'Parcel Electron process dead. Kill Parcel Frontend process'
							);
							parcelFrontedProcess.kill();
						});
					});

					break;
				}
				default:
					throw new Error(`Unknown target: ${options.target}`);
			}
		}
	);

	parcelFrontedProcess.on('exit', () => {
		logger.debug('Parcel Frontend process dead');
	});
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
