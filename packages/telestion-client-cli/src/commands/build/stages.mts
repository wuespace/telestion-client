import { relative } from 'path';
import chalk from 'chalk';
import ora from 'ora';

import { getLogger, lastAtLeast, wait } from '../../lib/index.mjs';
import { build } from '../../actions/parcel.mjs';
import {
	clearNativeDependencies,
	generateDistPackageJson,
	installNativeDependencies
} from '../../actions/electron.mjs';
import {
	packageElectron,
	PackageOptions
} from '../../actions/electron-packager.mjs';

const logger = getLogger('Build Stage');

export async function buildStage(projectDir: string): Promise<void> {
	const spinner = ora('Build project');

	try {
		spinner.start();
		await wait(1500);
		spinner.stop();
		await build(projectDir);
		console.log(); // separate console output
		spinner.succeed('Project successfully built');
	} catch (err) {
		spinner.fail('Cannot build project');
		throw err;
	}
}

export async function electronInstallStage(
	projectDir: string,
	packageJson: Record<string, unknown>
): Promise<void> {
	const spinner = ora('Clear native dependencies');

	try {
		spinner.start();
		await lastAtLeast(1000, clearNativeDependencies(projectDir));
	} catch (err) {
		spinner.fail('Cannot clear native dependencies');
		throw err;
	}

	let nativeDependencies: string[];
	try {
		spinner.text = 'Generate distribution configuration';
		nativeDependencies = await lastAtLeast(
			1000,
			generateDistPackageJson(projectDir, packageJson)
		);
	} catch (err) {
		spinner.fail('Cannot generate distribution configuration');
		throw err;
	}

	try {
		spinner.text = 'Install native dependencies';
		await wait(1500);
		spinner.stop();
		await installNativeDependencies(projectDir, nativeDependencies);
		console.log(); // separate console output
		spinner.succeed('Native dependencies installed');
	} catch (err) {
		spinner.fail('Cannot install native dependencies');
		throw err;
	}
}

function printPackagePaths(projectDir: string, paths: string[]): void {
	for (const path of paths) {
		const relativePath = relative(projectDir, path);
		const prefix = paths.indexOf(path) === paths.length - 1 ? '└─' : '├─';
		console.log(chalk.magenta(`${prefix} ${relativePath}`));
	}
}

export async function electronPackageStage(
	projectDir: string,
	options: PackageOptions
): Promise<void> {
	const spinner = ora('Generate Electron packages');

	try {
		spinner.start();
		await wait(1500);
		spinner.stop();
		const paths = await packageElectron(projectDir, options);
		console.log(); // separate console output
		logger.debug('Package paths:', paths);
		spinner.succeed('Electron packages generated');

		printPackagePaths(projectDir, paths);
	} catch (err) {
		spinner.fail('Cannot generate Electron packages');
		throw err;
	}
}
