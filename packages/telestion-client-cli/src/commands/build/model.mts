import os from 'node:os';
import { BaseOptions } from '../../model/index.mjs';
import {
	ArchOption,
	PlatformOption
} from '../../actions/electron-packager.mjs';

export type BuildPlatformOption = PlatformOption | null;

export type BuildArchOption = ArchOption | null;

export interface BuildOptions extends BaseOptions {
	/**
	 * A list of platforms to build the PSC for.
	 */
	platform: BuildPlatformOption[];

	/**
	 * A list of architectures to build the PSC for.
	 */
	arch: BuildArchOption[];

	/**
	 * Whether the PSC should get packaged as an Electron app.
	 */
	electron: boolean;
}

export const possiblePlatforms: BuildPlatformOption[] = [
	'darwin',
	'linux',
	'mas',
	'win32',
	'all'
];

export const possibleArchitectures: BuildArchOption[] = [
	'ia32',
	'x64',
	'armv7l',
	'arm64',
	'all'
];

/**
 * Returns the build platform based on the current node platform.
 * Is `null`, when the current node platform doesn't match
 * with any build platform.
 */
export function getPlatform(): BuildPlatformOption {
	switch (os.type()) {
		case 'Windows_NT':
			return 'win32';
		case 'Darwin':
			return 'darwin';
		case 'Linux':
			return 'linux';
		default:
			return null;
	}
}

/**
 * Returns the build architecture based on the current node architecture.
 * Is `null`, when the current node architecture doesn't match
 * with any build architecture.
 */
export function getArchitecture(): BuildArchOption {
	switch (os.arch()) {
		case 'arm':
			return 'armv7l';
		case 'arm64':
			return 'arm64';
		case 'ia32':
			return 'ia32';
		case 'x32':
		case 'x64':
			return 'x64';
		default:
			return null;
	}
}

/**
 * Default options for template command.
 */
export const defaultBuildOptions: Partial<BuildOptions> = {
	platform: [getPlatform()],
	arch: [getArchitecture()],
	electron: true
};
