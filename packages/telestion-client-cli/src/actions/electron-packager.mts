import packager from 'electron-packager';
import { rebuild } from 'electron-rebuild';

import { getLogger, mkdir } from '../lib/index.mjs';
import { join } from 'path';

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
	const distFolderPath = join(projectDir, distFolderName);
	const outFolderPath = join(projectDir, outFolderName);
	logger.debug('Distribution folder path:', distFolderPath);
	logger.debug('Output folder path:', outFolderPath);

	await mkdir(outFolderPath, true);

	logger.debug('Run packager with:', options);
	return packager({
		...options,
		dir: distFolderPath,
		out: outFolderPath,
		afterCopy: [
			(buildPath, electronVersion, platform, arch, callback) => {
				rebuild({ buildPath, electronVersion, arch })
					.then(() => callback())
					.catch(error => callback(error));
			}
		]
	});
}
