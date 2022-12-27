import packager from 'electron-packager';
import { rebuild } from '@electron/rebuild';

import { exists, getLogger, mkdir, rm } from '../lib/index.mjs';
import { join } from 'path';
import { getPSCConfig } from '../lib/config.mjs';

const logger = getLogger('Electron Packager');

const distFolderName = 'dist';
const outFolderName = 'release';

export type PlatformOption = 'darwin' | 'linux' | 'mas' | 'win32' | 'all';

export type ArchOption = 'ia32' | 'x64' | 'armv7l' | 'arm64' | 'all';

export interface PackageOptions {
	platform: PlatformOption[];
	arch: ArchOption[];
}

/**
 * Packages the distribution directory into Electron containers.
 * @param projectDir - path to project root
 * @param options - additional package options
 */
export async function packageElectron(
	projectDir: string,
	options: PackageOptions
): Promise<string[]> {
	const config = await getPSCConfig();
	const distFolderPath = join(projectDir, distFolderName);
	const outFolderPath = join(projectDir, config.out ?? outFolderName);
	logger.debug('Distribution folder path:', distFolderPath);
	logger.debug('Output folder path:', outFolderPath);

	if (await exists(outFolderPath)) {
		logger.debug('Output folder exists. Deleting it to continue...');
		await rm(outFolderPath, true);
	}

	await mkdir(outFolderPath, true);

	const platform = options.platform.flatMap(current =>
		current === 'all' ? ['darwin', 'linux', 'mas', 'win32'] : [current]
	);
	const arch = options.arch.flatMap(current =>
		current === 'all' ? ['ia32', 'x64', 'armv7l', 'arm64'] : [current]
	);

	logger.debug('Run packager with:', options);
	const paths = await packager({
		platform,
		arch,
		dir: distFolderPath,
		out: outFolderPath,
		asar: true,
		...config,
		afterCopy: [
			(buildPath, electronVersion, platform, arch, callback) => {
				rebuild({ buildPath, electronVersion, arch })
					.then(() => callback())
					.catch(error => callback(error));
			},
			...(config.afterCopy ?? [])
		]
	});

	// electron-packager lied to us, so we have to filter ourselves
	return paths.filter(path => typeof path === 'string');
}
