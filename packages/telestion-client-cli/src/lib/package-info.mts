import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from './native/index.mjs';

// we need to go up 3 steps:
// 1. from "file" to "lib"
// 2. from "lib" to "dist"
// 3. from "dist" to project root
export const packageRootPath = resolve(
	fileURLToPath(import.meta.url),
	'..',
	'..',
	'..'
);

export const packageJsonPath = join(packageRootPath, 'package.json');
export const resourcesPath = join(packageRootPath, 'resources');
const packageJson = JSON.parse(await readFile(packageJsonPath));

/**
 * Returns the current version of the `@wuespace/telestion-client-cli` package.
 */
export function getPackageVersion(): string {
	return packageJson['version'] || '0.0.0';
}
