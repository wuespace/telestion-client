import { join } from 'path';
import inquirer from 'inquirer';
import { ChildProcess } from 'child_process';

import { BaseWithPartial } from '../../model/index.mjs';
import { exit, getLogger, openUrl, readFile } from '../../lib/index.mjs';
import { getPSCRoot } from '../../actions/psc.mjs';
import {
	generateDistPackageJson,
	installNativeDependencies,
	start as startElectron
} from '../../actions/electron.mjs';

import { defaultOptions, StartOptions } from './model.mjs';
import {
	parcelServeFrontendStage,
	parcelWatchElectronStage
} from './stages.mjs';

const logger = getLogger('Start');

/**
 * The actual command.
 * @param options - the complete options set
 */
export async function start(options: StartOptions): Promise<unknown[]> {
	const errors: unknown[] = [];
	logger.debug('Received options:', options);

	const projectDir = await getPSCRoot(options.workingDir);
	logger.debug('Resolved PSC root:', projectDir);

	if (!projectDir) {
		throw new Error('Not in a Telestion Frontend Project');
	}

	const packageJson = JSON.parse(
		await readFile(join(projectDir, 'package.json'))
	) as Record<string, unknown>;
	logger.debug('PSC package.json:', packageJson);

	// 1. Start Parcel in "serve" mode for frontend target
	let serveFrontendBuilt = false;
	await parcelServeFrontendStage(projectDir, options, async stop1 => {
		// multiple call prevention
		if (serveFrontendBuilt) return;
		serveFrontendBuilt = true;

		// open external browser if requested
		if (options.target === 'browser') {
			if (options.open) openUrl(new URL(`http://localhost:${options.port}/`));
			return;
		}

		// 2. Start Parcel in "watch" mode for electron target
		try {
			// preparation of needed content (must not be re-created every build success event)
			let dispatching = false;
			let electronProcess: ChildProcess;
			let oldStop2: () => void;

			await parcelWatchElectronStage(projectDir, options, async stop2 => {
				// prevent too fast calls
				if (dispatching) {
					logger.debug(
						'Already dispatching Electron restart. Please be patient'
					);
					return;
				}

				dispatching = true; /// +++ GUARD START +++

				// no multiple call prevention here because we want to kill
				// and restart Electron on main process changes
				try {
					if (electronProcess) {
						electronProcess.off('exit', oldStop2);
						electronProcess.kill('SIGHUP');
					}
					// store stop command to unregister it later from old electron process in case of reload
					oldStop2 = stop2;

					await generateDistPackageJson(projectDir, packageJson);
					await installNativeDependencies(projectDir);
					electronProcess = await startElectron(projectDir, options.port);
					electronProcess.on('exit', stop2);
				} catch (err) {
					// capture fatal errors
					errors.push(err);
					stop2();
				}

				dispatching = false; /// +++ GUARD END +++
			});
		} catch (err) {
			// capture fatal errors
			errors.push(err);
		} finally {
			// stop 1. layer once 2. layer finishes
			stop1();
		}
	});

	return errors;
}

/**
 * Asks the user some questions on some missing parts in the current options set.
 * @param options - the current options set (does not have to be complete)
 */
export async function hydrate(
	options: BaseWithPartial<StartOptions>
): Promise<StartOptions> {
	return inquirer.prompt<StartOptions>(
		[
			{
				type: 'list',
				name: 'target',
				message: 'Select the output target:',
				choices: ['electron', 'browser'],
				default: defaultOptions.target
			},
			{
				type: 'number',
				name: 'port',
				message: 'Port number on which the dev server should hear on:',
				default: defaultOptions.port
			},
			{
				type: 'confirm',
				name: 'open',
				message: 'Open the browser after the dev server has started?',
				default: defaultOptions.open
			}
		],
		options
	);
}
