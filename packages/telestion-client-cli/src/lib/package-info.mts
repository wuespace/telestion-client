import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFile } from './native.mjs';

// we need to go up 3 steps: 1 from file to lib, 1 from lib to dist, 1 from dist to project root
export const packageRootPath = resolve(
	fileURLToPath(import.meta.url),
	'..',
	'..',
	'..'
);

const packageJsonPath = join(packageRootPath, 'package.json');
const packageJson = JSON.parse(await readFile(packageJsonPath));

/**
 * Returns the current version of the `@wuespace/telestion-client-cli` package.
 */
export function getPackageVersion(): string {
	return packageJson['version'] || '0.0.0';
}
