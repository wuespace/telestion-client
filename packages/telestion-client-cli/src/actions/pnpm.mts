import { join, relative } from 'path';
import os from 'os';
import {
	chmod,
	CompositeError,
	exec,
	exists,
	getBinaries,
	getLogger,
	mkdir,
	readDir,
	readFile,
	realPath,
	stat,
	symlink,
	writeFile
} from '../lib/index.mjs';

const logger = getLogger('PNPM Action');

// TODO: Change to 'latest' once pnpm v7 is stable
const pnpmVersion = 'next-7';

// TODO: Remove custom global linking once global linking is stable and mostly bug-free
const useCustomGlobalLinking = true;

/**
 * Checks if PNPM is installed.
 */
export async function isPnpmInstalled(): Promise<boolean> {
	try {
		await exec('pnpm', ['--version']);
		return true;
	} catch (err) {
		return false;
	}
}

/**
 * Installs PNPM globally via NPM.
 */
export async function installPnpm(): Promise<void> {
	const installed = await isPnpmInstalled();

	// take the fast lane
	if (!installed) {
		try {
			logger.debug(`Install pnpm ${pnpmVersion} globally via npm`);
			await exec('npm', ['install', '--global', `pnpm@${pnpmVersion}`]);
		} catch (err) {
			throw new CompositeError('Cannot install PNPM', err);
		}
	}

	try {
		logger.debug('Set up PNPM');
		await exec('pnpm', ['setup']);
	} catch (err) {
		throw new CompositeError('Cannot set up PNPM', err);
	}
}

/**
 * Installs dependencies in the specified project.
 * @param projectDir - the path to the project containing a valid `package.json`
 */
export async function pnpmInstall(projectDir: string): Promise<void> {
	logger.debug('Install dependencies');
	logger.debug('Project directory:', projectDir);

	try {
		await exec('pnpm', ['install'], projectDir);
	} catch (err) {
		throw new CompositeError('Cannot install dependencies', err);
	}
}

/**
 * Links a package into PNPM global store.
 * @param projectDir - the path to the project that should be globally available
 */
export async function pnpmLinkToGlobal(projectDir: string): Promise<void> {
	logger.debug('Make project available in global store');
	logger.debug('Project directory:', projectDir);

	try {
		await exec('pnpm', ['link', '--global'], projectDir);
	} catch (err) {
		throw new CompositeError(
			`Cannot link project '${projectDir}' to global store`,
			err
		);
	}
}

/**
 * Links a globally available package into the specified project.
 * @param projectDir - the path to the project that receives the link
 * @param dependencyName - the name of the globally available package that is going to be linked
 */
export async function pnpmLinkFromGlobal(
	projectDir: string,
	dependencyName: string
): Promise<void> {
	logger.debug('Link dependency from global store into project');
	logger.debug('Project directory:', projectDir);
	logger.debug('Global dependency:', dependencyName);

	// Some notes to the custom method:
	// Sometimes the 'pnpm link --global @wuespace/telestion-client-cli' and other global linked packages
	// aren't linked correctly into the destination project.
	// Therefore, this custom method exists which should do this process more reliably.
	// Differences to default version:
	// - link to global binary instead of "real" file
	// - the search paths inside the PNPM home directory are mostly hardcoded
	//   (I currently don't see any other occurrences)
	if (useCustomGlobalLinking) {
		logger.debug('Use custom global linking method');

		// scrape pnpm home path
		const pnpmHomePath = process.env['PNPM_HOME'];
		if (!pnpmHomePath) {
			throw new Error(
				'Environment variable PNPM_HOME is undefined. You need to setup PNPM first'
			);
		}
		logger.debug('PNPM Home Path:', pnpmHomePath);

		// check global packages path
		const globalPackagesPath = join(
			pnpmHomePath,
			'global-packages',
			'5',
			'node_modules'
		);
		logger.debug('PNPM Default Global packages path:', globalPackagesPath);
		if (!(await exists(globalPackagesPath))) {
			throw new Error('No global packages installed via PNPM');
		}
		if (!(await stat(globalPackagesPath)).isDirectory()) {
			throw new Error(
				`Global packages path not a directory. Please remove this file and try again: ${globalPackagesPath}`
			);
		}

		// cut package in scope(s) and package name
		const slices = dependencyName.split('/');
		logger.debug('Dependency slices:', slices);
		const globalDependencyPath = join(globalPackagesPath, ...slices);
		logger.debug('Global dependency source path:', globalDependencyPath);
		if (!(await exists(globalDependencyPath))) {
			throw new Error(
				`Dependency ${dependencyName} does not exist in global package store`
			);
		}

		// resolve symlink destination
		const dependencyPath = await realPath(globalDependencyPath);
		logger.debug('Resolved dependency path:', dependencyPath);

		// we have the actual path to the global linked dependency
		// link it into the node_modules of the project dir

		// create scope directories
		const projectDepScopeDir = join(
			projectDir,
			'node_modules',
			...slices.slice(0, -1)
		); // slice package-name off
		logger.debug('Project dependency scope directory:', projectDepScopeDir);
		await mkdir(projectDepScopeDir, true);

		// create symlink
		const projectDependencyLink = join(
			projectDepScopeDir,
			slices.at(-1) as string
		); // only use package name
		logger.debug('Project dependency link:', projectDependencyLink);
		const relativeDependencyPath = relative(projectDepScopeDir, dependencyPath);
		logger.debug('Relative dependency path:', relativeDependencyPath);
		await symlink(
			os.type() === 'Windows_NT' ? dependencyPath : relativeDependencyPath,
			projectDependencyLink,
			os.type() === 'Windows_NT' ? 'junction' : 'file'
		);
		logger.info('Package linked');

		logger.debug('On platform:', os.type());
		if (os.type() !== 'Windows_NT') {
			logger.debug('Link on this platform');

			// extract binary names from dependency package.json
			const dependencyPackageJsonPath = join(dependencyPath, 'package.json');
			logger.debug('Dependency package.json path:', dependencyPackageJsonPath);
			const dependencyPackageJson = JSON.parse(
				await readFile(dependencyPackageJsonPath)
			) as Record<string, unknown>;
			logger.debug('Dependency package.json:', dependencyPackageJson);
			const binaries = await getBinaries(dependencyPackageJson);
			logger.debug('Extracted binaries:', binaries);
			const binaryNames = Object.keys(binaries);
			logger.debug('Binary names:', binaryNames);

			// find available and unavailable global binaries
			const availableBinaries = await readDir(pnpmHomePath);
			logger.debug('Available global binaries:', availableBinaries);

			const linkBinaries = binaryNames.filter(binary =>
				availableBinaries.includes(binary)
			);
			const missingBinaries = binaryNames.filter(
				binary => !availableBinaries.includes(binary)
			);
			logger.debug('Linked binaries:', linkBinaries);
			logger.debug('Missing binaries:', missingBinaries);

			const projectBinDir = join(projectDir, 'node_modules', '.bin');
			logger.debug('Project bin directory:', projectBinDir);
			await mkdir(projectBinDir, true);

			// link them into node_modules/.bin
			for (const binaryName of linkBinaries) {
				logger.debug(
					`Link binary '${binaryName}' into project binary directory '${projectBinDir}'`
				);

				const globalBinaryPath = join(pnpmHomePath, binaryName);
				const projectBinaryPath = join(projectBinDir, binaryName);
				logger.debug('Global binary path:', globalBinaryPath);
				logger.debug('Project binary path:', projectBinaryPath);

				const content = `#!/bin/sh
exec "${globalBinaryPath}"
`;
				logger.debug('Binary file content:', content);

				await writeFile(projectBinaryPath, content);
				await chmod(projectBinaryPath, '755'); // make file executable
				logger.debug(`'${binaryName}' written`);
			}
			logger.info('All exported binaries linked');
		} else {
			logger.info(
				'Skip binary linking due to platform selection. (PNPM does not link on Windows_NT)'
			);
		}
	} else {
		logger.debug('Use default global linking method');

		try {
			await exec('pnpm', ['link', '--global', dependencyName], projectDir);
		} catch (err) {
			throw new CompositeError(
				`Cannot link global dependency '${dependencyName}' into project '${projectDir}'`,
				err
			);
		}
	}
}
