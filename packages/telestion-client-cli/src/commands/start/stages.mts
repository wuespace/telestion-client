import { getLogger } from '../../lib/index.mjs';
import { serve, watch } from '../../actions/parcel.mjs';
import { StartOptions } from './model.mjs';

const logger = getLogger('Start Stage');

export type BuildEventHandler = (stop: () => void) => void | Promise<void>;

export async function parcelServeFrontendStage(
	projectDir: string,
	options: StartOptions,
	onBuildSuccess: BuildEventHandler
): Promise<void> {
	logger.debug('Start Parcel serve for frontend target');
	return serve(
		projectDir,
		{ port: options.port, targets: ['frontend'] },
		(event, stop) => {
			logger.debug('New build event in frontend serve received:', event);
			if (event.type === 'buildSuccess') {
				logger.debug('Emit build success event in frontend serve');
				// fire and forget
				onBuildSuccess(() => {
					logger.debug('Stop frontend serve');
					stop();
				});
			}
		}
	);
}

export async function parcelWatchElectronStage(
	projectDir: string,
	options: StartOptions,
	onBuildSuccess: BuildEventHandler
): Promise<void> {
	logger.debug('Start Parcel watch for electron target');
	return watch(projectDir, { targets: ['electron'] }, (event, stop) => {
		logger.debug('New build event in electron watch received:', event);
		if (event.type === 'buildSuccess') {
			logger.debug('Emit build success event in electron watch');
			// fire and forget
			onBuildSuccess(() => {
				logger.debug('Stop electron watch');
				stop();
			});
		}
	});
}
