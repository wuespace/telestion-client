import {
	commonJsPlugin,
	dtsPlugin,
	externalsPlugin,
	imagePlugin,
	licensePlugin,
	postCssPlugin,
	resolvePlugin,
	terserPlugin,
	typeScriptPlugin
} from './rollup.plugins';

/**
 * @typedef BuildPaths
 * @type {object}
 * @property {string} packageJsonPath - the path to the package.json
 * @property {string} inputPath - the path to the entry source file
 * @property {string} typesRootPath - the path to the package types built via tsc
 */

/**
 * package names of all monorepo packages in this project
 * @type {string[]}
 */
// TODO: Use function from scripts/replace-package-versions.js
export const monorepoPackages = [
	'@wuespace/telestion-client-cli',
	'@wuespace/telestion-client-common',
	'@wuespace/telestion-client-core',
	'@wuespace/telestion-client-prop-types',
	'@wuespace/telestion-client-template',
	'@wuespace/telestion-client-types',
	'@wuespace/vertx-event-bus',
	'@wuespace/vertx-mock-server'
];

/**
 * Generates a rollup configuration which transpiles a TypeScript library.
 * @param {BuildPaths} paths - the required paths to build prerequisites
 */
export function buildTSLibrary(paths) {
	const packageJson = require(paths.packageJsonPath);

	return {
		input: paths.inputPath,
		output: [
			{
				file: packageJson.main,
				format: 'cjs',
				sourcemap: true
			},
			{
				file: packageJson.module,
				format: 'esm',
				sourcemap: true
			}
		],
		plugins: [
			externalsPlugin(paths.packageJsonPath, monorepoPackages),
			resolvePlugin(),
			commonJsPlugin(),
			typeScriptPlugin(),
			terserPlugin(),
			licensePlugin()
		]
	};
}

/**
 * Generates a rollup configuration which transpiles a React library
 * written in TypeScript.
 * @param {BuildPaths} paths - the required paths to build prerequisites
 */
export function buildReactLibrary(paths) {
	const packageJson = require(paths.packageJsonPath);

	return {
		input: paths.inputPath,
		output: [
			{
				file: packageJson.main,
				format: 'cjs',
				sourcemap: true
			},
			{
				file: packageJson.module,
				format: 'esm',
				sourcemap: true
			}
		],
		plugins: [
			externalsPlugin(paths.packageJsonPath, monorepoPackages),
			imagePlugin(),
			resolvePlugin(),
			commonJsPlugin(),
			typeScriptPlugin(),
			postCssPlugin(),
			terserPlugin(),
			licensePlugin()
		]
	};
}

/**
 * Generates a rollup configuration which transpiles a TypeScript library.
 * @param {BuildPaths} paths - the required paths to build prerequisites
 */
export function buildTSDeclarations(paths) {
	const packageJson = require(paths.packageJsonPath);

	return {
		input: paths.typesRootPath,
		output: [
			{
				file: packageJson.types,
				format: 'es'
			}
		],
		plugins: [
			externalsPlugin(paths.packageJsonPath, monorepoPackages),
			dtsPlugin(),
			licensePlugin()
		]
	};
}
