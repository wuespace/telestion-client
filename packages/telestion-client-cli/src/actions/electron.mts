import os from 'os';
import { join, relative } from 'path';
import { ChildProcess } from 'child_process';

import {
	getDescription,
	getElectronDependencies,
	getLogger,
	getName,
	getPackagePath,
	getVersion,
	mkdir,
	readFile,
	resolveElectronDependencies,
	rmIfExists,
	spawn,
	symlink,
	writeFile
} from '../lib/index.mjs';
import { hasWorkspaceTag } from './workspace.mjs';

const logger = getLogger('Electron Action');

const distFolderName = 'dist';
const mainProcessFileName = 'electron.js';

/**
 * Generates the distribution `package.json`.
 * The Electron main process reads this file on startup.
 *
 * Dependencies listed in the project's `package.json`
 * as `"electronDependencies"` are mapped to production dependencies.
 * In the next step these production dependencies should be installed.
 *
 * @param projectDir - path to project directory
 * @param packageJson - object that represents the project's `package.json`
 * @return a list of resolved native dependencies
 */
export async function generateDistPackageJson(
	projectDir: string,
	packageJson: Record<string, unknown>
): Promise<string[]> {
	logger.debug('Project directory:', projectDir);
	logger.debug('Received project package.json:', packageJson);

	const distPackageJsonPath = join(projectDir, distFolderName, 'package.json');
	const distPackageJson: Record<string, unknown> = {
		name: await getName(packageJson),
		description: await getDescription(packageJson),
		version: await getVersion(packageJson),
		main: mainProcessFileName,
		dependencies: await resolveElectronDependencies(packageJson)
	};

	logger.debug('Distribution package.json path:', distPackageJsonPath);
	logger.debug('Generated distribution package.json:', distPackageJson);

	await writeFile(
		distPackageJsonPath,
		JSON.stringify(distPackageJson, null, 2)
	);

	return getElectronDependencies(packageJson);
}

/**
 * Copies a dependency from the project's `node_modules` store
 * to the distribution `node_modules` store.
 * This gives Electron access to its native dependencies.
 *
 * > Note: This method doesn't work when you need to create Electron containers.
 * The `electron-packager` needs a flat `node_modules` tree.
 * Only really use this method if you have workspace dependencies
 * in your project. Otherwise, use the npm install method from below.
 *
 * @param specifier - the scope + package name of the dependency
 * @param projectDir - path to the project directory
 */
export async function linkNativeDependency(
	specifier: string,
	projectDir: string
): Promise<void> {
	logger.debug(`Link dependency ${specifier}`);
	const parts = specifier.split('/');
	const scope = parts.slice(0, -1);
	const packageName = parts.at(-1) as string;
	logger.debug('Dependency scope:', scope);
	logger.debug('Dependency package name:', packageName);

	const modulesDir = join(projectDir, 'node_modules');
	const distModulesDir = join(projectDir, distFolderName, 'node_modules');
	logger.debug('Modules directory:', modulesDir);
	logger.debug('Dist modules directory:', distModulesDir);

	const sourcePath = join(modulesDir, ...scope, packageName);
	const destDir = join(distModulesDir, ...scope);
	const destPath = join(destDir, packageName);
	const relSourcePath = relative(destDir, sourcePath);
	logger.debug('Source path:', sourcePath);
	logger.debug('Destination directory:', destDir);
	logger.debug('Destination path:', destPath);
	logger.debug(
		'Relative source path (relative to destination dir):',
		relSourcePath
	);

	await mkdir(destDir, true);
	await rmIfExists(destPath, true);
	await symlink(
		os.type() === 'Windows_NT' ? sourcePath : relSourcePath,
		destPath,
		os.type() === 'Windows_NT' ? 'junction' : 'file'
	);
}

/**
 * Installs the native dependencies specified in the distribution `package.json`.
 * @param projectDir - path to the project directory
 * @param nativeDependencies - a list of resolved native dependencies
 */
export async function installNativeDependencies(
	projectDir: string,
	nativeDependencies: string[]
): Promise<void> {
	const distDir = join(projectDir, distFolderName);
	logger.debug('Project directory:', projectDir);
	logger.debug('Distribution directory:', distDir);

	if (await hasWorkspaceTag(projectDir)) {
		logger.debug(
			'Workspace tag detected. Use symbolic links to refer to already installed native dependencies'
		);

		await Promise.all(
			nativeDependencies.map(specifier =>
				linkNativeDependency(specifier, projectDir)
			)
		);
	} else {
		logger.debug(
			'Has no workspace tag. Use npm to install native dependencies'
		);

		return new Promise<void>((resolve, reject) => {
			// install native dependencies via npm in the distribution folder
			logger.debug('Install native dependencies');
			const npmProcess = spawn(
				'npm',
				['install', '--no-save', '--no-package-lock'],
				{ cwd: distDir }
			);

			// pass through process output
			npmProcess.stdout?.pipe(process.stdout);
			npmProcess.stderr?.pipe(process.stderr);

			npmProcess.on('exit', code => (code === 0 ? resolve() : reject()));
		});
	}
}

/**
 * Removes any residing native dependencies
 * from the distribution `node_modules` store.
 *
 * @param projectDir - path to the project directory
 */
export async function clearNativeDependencies(
	projectDir: string
): Promise<void> {
	const distModulesDir = join(projectDir, distFolderName, 'node_modules');
	logger.debug('Project directory:', projectDir);
	logger.debug('Distribution module directory:', distModulesDir);

	await rmIfExists(distModulesDir, true);
}

/**
 * Starts Electron in development mode. It reads all components
 * from the distribution folder.
 *
 * @param projectDir - path to the project directory
 * @param devServerPort - port on which the development listens.
 * Electron receives this port via the `"DEV_SERVER_PORT"` environment variable.
 * @return the spawned Electron child process
 */
export async function start(
	projectDir: string,
	devServerPort: number
): Promise<ChildProcess> {
	logger.debug('Project directory:', projectDir);
	logger.debug('Development server port:', devServerPort);

	const electronPackagePath = await getPackagePath('electron');
	const electronBinaryName = await readFile(
		join(electronPackagePath, 'path.txt')
	);
	const electronBinaryPath = join(
		electronPackagePath,
		'dist',
		electronBinaryName
	);
	logger.debug('Electron binary name:', electronBinaryName);
	logger.debug('Electron package path:', electronPackagePath);
	logger.debug('Electron binary path:', electronBinaryPath);

	const distFolderPath = join(projectDir, distFolderName);
	logger.debug('Distribution folder path:', distFolderPath);

	logger.debug('Fork electron main process');
	const electronProcess = spawn(electronBinaryPath, [distFolderPath], {
		cwd: projectDir,
		env: {
			// Electron needs access to the user environment variables (e.g. $DISPLAY)
			...process.env,
			DEV_SERVER_PORT: `${devServerPort}`
		}
	});

	// pass through process output
	electronProcess.stdout?.pipe(process.stdout);
	electronProcess.stderr?.pipe(process.stderr);

	return electronProcess;
}
