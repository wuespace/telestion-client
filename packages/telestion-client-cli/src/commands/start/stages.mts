import { ChildProcess } from 'node:child_process';

import { getLogger } from '../../lib/index.mjs';
import { serve, watch } from '../../actions/parcel.mjs';
import {
	generateDistPackageJson,
	installNativeDependencies
} from '../../actions/electron.mjs';
import { StartOptions } from './model.mjs';

const logger = getLogger('Start Stage');

export function parcelServeFrontendStage(
	projectDir: string,
	options: StartOptions,
	onBuildFinish: (parcelProcess: ChildProcess) => void
): ChildProcess {
	logger.debug('Start Parcel serve for frontend target');

	let serveFrontendBuilt = false;
	return serve(
		projectDir,
		{ port: options.port, targets: ['frontend'] },
		(event, parcelProcess) => {
			logger.debug('New build event in frontend serve received:', event);

			// skip non build success events
			if (event.type !== 'buildSuccess') return;

			// multiple call prevention
			if (serveFrontendBuilt) return;
			serveFrontendBuilt = true;

			onBuildFinish(parcelProcess);
		}
	);
}

export function parcelWatchElectronStage(
	projectDir: string,
	options: StartOptions,
	onBuildSuccess: (parcelProcess: ChildProcess) => void
): ChildProcess {
	logger.debug('Start Parcel watch for electron target');

	return watch(
		projectDir,
		{ targets: ['electron'] },
		(event, parcelProcess) => {
			logger.debug('New build event in electron watch received:', event);

			// skip non build success events
			if (event.type !== 'buildSuccess') return;

			return onBuildSuccess(parcelProcess);
		}
	);
}

export async function prepareElectronEnvironment(
	projectDir: string,
	packageJson: Record<string, unknown>
): Promise<void> {
	const nativeDependencies = await generateDistPackageJson(
		projectDir,
		packageJson
	);
	await installNativeDependencies(projectDir, nativeDependencies);
}
