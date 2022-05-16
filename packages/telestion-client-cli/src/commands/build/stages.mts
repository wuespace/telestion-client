import { relative, sep } from 'path';
import chalk from 'chalk';
import ora from 'ora';
import objectTreeify from 'object-treeify';

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

const { treeify } = objectTreeify;

const logger = getLogger('Build Stage');

export async function buildStage(projectDir: string): Promise<void> {
	const spinner = ora('Build project');

	try {
		await build(projectDir);
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
		await wait(500);
		spinner.stop();
		await lastAtLeast(
			500,
			installNativeDependencies(projectDir, nativeDependencies)
		);
		spinner.succeed('Native dependencies installed');
	} catch (err) {
		spinner.fail('Cannot install native dependencies');
	}
}

function insertIntoObj(
	obj: Record<string, unknown>,
	pointer: string[],
	value: string | null,
	depth: number = 0
): Record<string, unknown> {
	// empty edge case
	if (pointer.length === 0) {
		return obj;
	}

	const depthKey = pointer[depth];

	// exit condition
	if (depth === pointer.length - 1) {
		obj[depthKey] = value;
		return obj;
	}

	if (typeof obj[depthKey] !== 'object') {
		obj[depthKey] = {};
	}

	return insertIntoObj(obj, pointer, value, depth + 1);
}

export async function electronPackageStage(
	projectDir: string,
	options: PackageOptions
): Promise<void> {
	const spinner = ora('Generate Electron packages');

	try {
		spinner.start();
		const paths = await packageElectron(projectDir, options);
		spinner.succeed('Electron packages generated');
		logger.debug('Package paths:', paths);

		const treeObject = paths.reduce((acc, path) => {
			const pointer = relative(projectDir, path).split(sep);
			return insertIntoObj(acc, pointer, null);
		}, {} as Record<string, unknown>);
		console.log(`${chalk.magenta(treeify(treeObject))}`);
	} catch (err) {
		spinner.fail('Cannot generate Electron packages');
		throw err;
	}
}
