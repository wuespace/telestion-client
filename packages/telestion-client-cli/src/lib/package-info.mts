import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFile } from './native.mjs';

// we need to go up two steps: 1x from lib to build, 1x from build to project root
const packageJsonPath = join(
	dirname(fileURLToPath(import.meta.url)),
	'..',
	'..',
	'package.json'
);
const packageJson = JSON.parse(await readFile(packageJsonPath));

/**
 * Returns the current version of the `@wuespace/telestion-client-cli` package.
 */
export function getPackageVersion(): string {
	return packageJson['version'] || '0.0.0';
}
