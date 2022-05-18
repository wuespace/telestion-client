import { ChildProcess } from 'node:child_process';

import { getLogger, openUrl } from '../../lib/index.mjs';
import { serve, watch } from '../../actions/parcel.mjs';
import {
	generateDistPackageJson,
	installNativeDependencies,
	startElectron
} from '../../actions/electron.mjs';
import { StartOptions } from './model.mjs';

const logger = getLogger('Start Stage');

export type EventHandler = (
	stop: () => void,
	parcelProcess: ChildProcess
) => Promise<void>;

export async function parcelServeFrontendStage(
	projectDir: string,
	options: StartOptions,
	onFinish: EventHandler
): Promise<void> {
	logger.debug('Start Parcel serve for frontend target');

	let serveFrontendBuilt = false;
	return serve(
		projectDir,
		{ port: options.port, targets: ['frontend'] },
		(event, stop, parcelProcess) => {
			logger.debug('New build event in frontend serve received:', event);

			// skip non build success events
			if (event.type !== 'buildSuccess') return Promise.resolve();

			// multiple call prevention
			if (serveFrontendBuilt) return Promise.resolve();
			serveFrontendBuilt = true;

			return onFinish(stop, parcelProcess);
		}
	);
}

export async function parcelWatchElectronStage(
	projectDir: string,
	options: StartOptions,
	onBuildSuccess: EventHandler
): Promise<void> {
	logger.debug('Start Parcel watch for electron target');
	return watch(
		projectDir,
		{ targets: ['electron'] },
		(event, stop, parcelProcess) => {
			logger.debug('New build event in electron watch received:', event);

			// skip non build success events
			if (event.type !== 'buildSuccess') return Promise.resolve();

			return onBuildSuccess(stop, parcelProcess);
		}
	);
}

export async function launchBrowser(
	projectDir: string,
	options: StartOptions
): Promise<void> {
	if (options.open) {
		return openUrl(new URL(`http://localhost:${options.port}/`));
	}

	return Promise.resolve();
}

let dispatching = false;

export async function launchElectron(
	projectDir: string,
	options: StartOptions,
	packageJson: Record<string, unknown>,
	previousProcess: ChildProcess,
	stop: () => void
): Promise<ChildProcess> {
	// prevent too fast calls
	if (dispatching) {
		logger.debug('Already dispatching Electron restart. Please be patient');
		// the first round this cannot be called
		return previousProcess;
	}

	dispatching = true; /// +++ GUARD START +++

	if (previousProcess) {
		logger.debug('Stop previous Electron process');
		previousProcess.removeAllListeners('exit');
		previousProcess.kill('SIGTERM');
		await new Promise<void>((resolve, reject) => {
			previousProcess.on('exit', (code, signal) =>
				code === 0 || !signal
					? resolve()
					: reject(
							new Error(
								`Previous Electron process failed with exit code '${code}' and signal '${signal}'`
							)
					  )
			);
		});
	}

	const nativeDependencies = await generateDistPackageJson(
		projectDir,
		packageJson
	);
	await installNativeDependencies(projectDir, nativeDependencies);

	logger.debug('Start new Electron process');
	const newProcess = startElectron(projectDir, options.port);
	newProcess.addListener('exit', (code, signal) => {
		logger.debug(
			`Current Electron process exited with code ${code} and signal ${signal}`
		);
		stop();
	});

	dispatching = false; /// +++ GUARD END +++

	return newProcess;
}
