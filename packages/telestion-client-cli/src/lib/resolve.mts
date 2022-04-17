import { createRequire } from 'module';
import { dirname } from 'path';

// opens up old require method in modern Module JS
// TODO: Move to import.meta.resolve once it's stable
// see https://nodejs.org/api/esm.html#importmetaresolvespecifier-parent
const require = createRequire(import.meta.url);

/**
 * Searches for an installed package and returns an absolute path to its install location.
 * Throws ERR_MODULE_NOT_FOUND if the package is not installed.
 * @param packageName - the name of the package to search for
 */
export async function getPackagePath(packageName: string): Promise<string> {
	// only providing package name resolves to main file
	// add '/some-file' searches in package root
	const packageJsonPath = require.resolve(packageName + '/package.json');
	// get parent directory
	return dirname(packageJsonPath);
}
