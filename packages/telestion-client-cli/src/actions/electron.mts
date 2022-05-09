import { join } from 'path';
import { ChildProcess } from 'child_process';

import {
	getDescription,
	getElectronDependencies,
	getLogger,
	getName,
	getPackagePath,
	getVersion,
	readFile,
	spawn,
	writeFile
} from '../lib/index.mjs';

const logger = getLogger('Electron Action');

const distFolderName = 'dist';
const mainProcessFileName = 'electron.js';

/**
 * Generates the distribution `package.json`.
 * The Electron main process reads this file on startup.
 *
 * Dependencies listed in the project's `package.json` as `"electronDependencies"` are mapped to production dependencies.
 * In the next step these production dependencies should be installed.
 *
 * @param projectDir - path to project directory
 * @param packageJson - object that represents the project's `package.json`
 */
export async function generateDistPackageJson(
	projectDir: string,
	packageJson: Record<string, unknown>
): Promise<void> {
	logger.debug('Project directory:', projectDir);
	logger.debug('Received project package.json:', packageJson);

	const distPackageJsonPath = join(projectDir, distFolderName, 'package.json');
	const distPackageJson: Record<string, unknown> = {
		name: await getName(packageJson),
		description: await getDescription(packageJson),
		version: await getVersion(packageJson),
		main: mainProcessFileName,
		dependencies: await getElectronDependencies(packageJson)
	};

	logger.debug('Distribution package.json path:', distPackageJsonPath);
	logger.debug('Generated distribution package.json:', distPackageJson);

	await writeFile(
		distPackageJsonPath,
		JSON.stringify(distPackageJson, null, 2)
	);
}

/**
 * Installs the native dependencies specified in the distribution `package.json`.
 * @param projectDir - path to the project directory
 */
export async function installNativeDependencies(
	projectDir: string
): Promise<void> {
	const distDir = join(projectDir, distFolderName);
	logger.debug('Project directory:', projectDir);
	logger.debug('Distribution directory:', distDir);

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

/**
 * Starts Electron in development mode. It reads all components from the distribution folder.
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
