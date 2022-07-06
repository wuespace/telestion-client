import inquirer from 'inquirer';

import { BaseWithPartial } from '../../model/index.mjs';
import {
	ChildProcess,
	EventEmitter,
	getLogger,
	openUrl
} from '../../lib/index.mjs';
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
export async function runStartCommand(
	options: StartOptions
): Promise<EventEmitter> {
	logger.debug('Received options:', options);

	const projectDir = await getPSCRoot(options.workingDir);
	const packageJson = await getPackageJson(projectDir);
	const eventEmitter = new EventEmitter();

	const parcelFrontedProcess = parcelServeFrontendStage(
		projectDir,
		options,
		() => {
			// this gets called only on the first successful build
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
						let disconnect: (() => ChildProcess) | undefined;
						const parcelElectronProcess = parcelWatchElectronStage(
							projectDir,
							options,
							() => {
								// gets called on every successful build

								disconnect?.().stop();
								prepareElectronEnvironment(projectDir, packageJson).then(() => {
									const electronProcess = startElectron(
										projectDir,
										options.port
									);
									disconnect = eventEmitter.connect(electronProcess);
								});
							}
						);

						eventEmitter.connect(parcelElectronProcess);
					});

					break;
				}
				default:
					throw new Error(`Unknown target: ${options.target}`);
			}
		}
	);

	eventEmitter.connect(parcelFrontedProcess);

	// register interrupt handlers
	process.on('SIGINT', () => {
		logger.debug("Main process received 'SIGINT'. Emit stop event");
		eventEmitter.stop('SIGINT');
	});
	process.on('SIGTERM', () => {
		logger.debug("Main process received 'SIGTERM'. Emit stop event");
		eventEmitter.stop('SIGTERM');
	});
	process.on('SIGHUP', () => {
		logger.debug("Main process received 'SIGHUP'. Emit stop event");
		eventEmitter.stop('SIGHUP');
	});

	return eventEmitter;
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
