import { join, basename } from 'path';
import { ChildProcess } from 'child_process';

import {
	exec,
	existsSync,
	getDescription,
	getElectronDependencies,
	getLogger,
	getName,
	getVersion,
	mkdir,
	readFileSync,
	rmIfExists,
	spawn,
	symlink,
	writeFile
} from '../lib/index.mjs';
import { hasWorkspaceTag } from './workspace.mjs';

const logger = getLogger('Electron Action');

const distFolderName = 'dist';
const mainProcessFileName = 'electron.js';

// TODO: Switch to PNPM once Electron doesn't break with std::bad_alloc
//  on sym-linked dependencies in node_modules
const usePnpmAsNativeInstaller = false;

// Electron-packager needs access to all dependencies.
const distNpmRcContent = `; autogenerated via tc-cli. DO NOT EDIT!
shamefully-hoist = true
lockfile = false`;

function versionFromBasename(basename: string): string {
	const versionAndHash = basename.split('@').at(-1);
	if (!versionAndHash) {
		throw new Error(
			'No version specifier found. ' +
				'Please report this issue in https://github.com/wuespace/telestion-client/issues/new. ' +
				'Sorry for the inconvenience. ' +
				`Received basename: ${basename}`
		);
	}

	// position 0 is always there
	return versionAndHash.split('_').at(0) as string;
}

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

	const electronDependencies = await getElectronDependencies(packageJson);
	logger.debug('Extracted Electron dependencies:', electronDependencies);

	const dependencies: Record<string, string> = {};
	for (const electronDependency of electronDependencies) {
		logger.debug('Find installed version for:', electronDependency);

		const result = await exec('pnpm', [
			'list',
			electronDependency,
			'--parseable'
		]);
		const fullPath = result.stdout.toString().split('\n').at(1);
		if (!fullPath) {
			throw new Error(
				`Dependency '${electronDependency}' is not installed. ` +
					'Please add it to the dependencies list in your package.json and try again.'
			);
		}
		const folderName = basename(fullPath);
		const version = versionFromBasename(folderName);
		logger.debug('Dependency folder name:', folderName);
		logger.debug('Installed version:', version);

		dependencies[electronDependency] = version;
	}

	const distPackageJsonPath = join(projectDir, distFolderName, 'package.json');
	const distPackageJson: Record<string, unknown> = {
		name: await getName(packageJson),
		description: await getDescription(packageJson),
		version: await getVersion(packageJson),
		main: mainProcessFileName,
		dependencies
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
	logger.debug('Source path:', sourcePath);
	logger.debug('Destination directory:', destDir);
	logger.debug('Destination path:', destPath);

	await mkdir(destDir, true);
	await rmIfExists(destPath, true);
	await symlink(sourcePath, destPath);
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
			'Has no workspace tag. Use package manager to install native dependencies'
		);

		if (usePnpmAsNativeInstaller) {
			logger.debug('Use PNPM as package manager');

			const distNpmRcPath = join(distDir, '.npmrc');
			logger.debug('Distribution .npmrc path:', distNpmRcPath);
			logger.debug('Write distribution .npmrc to configure pnpm');
			await writeFile(distNpmRcPath, distNpmRcContent);

			return new Promise<void>((resolve, reject) => {
				// install native dependencies via npm in the distribution folder
				logger.debug('Install native dependencies');
				const pnpmProcess = spawn('pnpm', ['install'], { cwd: distDir });

				// pass through process output
				pnpmProcess.stdout?.pipe(process.stdout);
				pnpmProcess.stderr?.pipe(process.stderr);

				pnpmProcess.on('exit', (code, signal) =>
					code === 0 || !signal
						? resolve()
						: reject(
								new Error(
									`Cannot install native dependencies with PNPM. Exit code: ${code}, Signal: ${signal}`
								)
						  )
				);
			});
		} else {
			logger.debug('Use NPM as package manager');

			return new Promise<void>((resolve, reject) => {
				logger.debug('Install native dependencies');
				const npmProcess = spawn('npm', ['install', '--no-package-lock'], {
					cwd: distDir
				});

				// pass through process output
				npmProcess.stdout?.pipe(process.stdout);
				npmProcess.stderr?.pipe(process.stderr);

				npmProcess.on('exit', (code, signal) =>
					code === 0 || !signal
						? resolve()
						: reject(
								new Error(
									`Cannot install native dependencies with NPM. Exit code: ${code}, Signal: ${signal}`
								)
						  )
				);
			});
		}
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
export function startElectron(
	projectDir: string,
	devServerPort: number
): ChildProcess {
	logger.debug('Project directory:', projectDir);
	logger.debug('Development server port:', devServerPort);

	const electronPackagePath = join(projectDir, 'node_modules', 'electron');
	if (!existsSync(electronPackagePath)) {
		throw new Error(
			'Electron binary not found. Is Electron installed in your project?'
		);
	}

	const electronBinaryName = readFileSync(
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

	logger.debug('Spawn electron main process');
	const electronProcess = spawn(electronBinaryPath, [distFolderPath], {
		cwd: projectDir,
		env: {
			...process.env,
			DEV_SERVER_PORT: `${devServerPort}`
		}
	});

	// pass through process output
	electronProcess.stdout?.pipe(process.stdout);
	electronProcess.stderr?.pipe(process.stderr);

	return electronProcess;
}
