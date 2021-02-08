const path = require('path');
const logger = require('../logger')('electron-thread-build');

/**
 * Compiles the `electron.js` file for the main thread of the Electron application.
 *
 * @param {string} projectRoot - the PSC's root path
 * @param {string[]} plugins - list of paths to plugins (.ts or .js)
 * @param {boolean} [production=true] - whether to use a production build config. In development,
 * http://localhost:3000 gets used
 * @return {Promise<void>}
 */
async function compileElectronMainThread(
	projectRoot,
	plugins,
	production = true
) {
	const webpack = require('webpack');
	const webpackConfig = buildWebpackConfig(projectRoot, plugins, production);
	const compiler = webpack(webpackConfig);
	await runWebpackCompilerAsync(compiler);
}

/**
 * The ts-loader configuration to additionally compile TS-based plugins
 */
const tsLoaderConfig = {
	test: /\.ts$/,
	loader: require.resolve('ts-loader'),
	options: {
		compilerOptions: {
			noEmit: false
		}
	},
	exclude: /node_modules/
};

/**
 * Creates a webpack config for compiling the Electron Main Process
 *
 * @param {string} projectRoot - absolute path to the PSC's root directory
 * @param {string[]} plugins - paths to plugin files (`.ts` or `.js`)
 * @param {boolean} [production=true] - whether to use a production build config. In development,
 * http://localhost:3000 gets used
 * @return {webpack.Configuration}
 */
function buildWebpackConfig(projectRoot, plugins, production = true) {
	return {
		entry: require.resolve('./static/electron-main.js'),
		mode: production ? 'production' : 'development',
		target: 'node',
		stats: 'errors-warnings',
		output: {
			path: path.join(projectRoot, 'build'),
			filename: 'electron.js',
			libraryTarget: 'commonjs2'
		},
		node: false,
		plugins: [getPluginProviderPlugin(projectRoot, plugins)],
		externals: { electron: 'electron' },
		module: {
			rules: [
				{
					test: require.resolve('./static/electron-main.js'),
					use: {
						loader: require.resolve(
							'./custom-webpack-loader/electron-main-import-plugins'
						),
						options: { plugins }
					}
				},
				tsLoaderConfig
			]
		},
		resolve: {
			extensions: ['.ts', '.js']
		}
	};
}

/**
 * Get a plugin configuration such that global variables `PLUGIN_0`, `PLUGIN_1`, ... exist in the `electron-main.js`
 * context
 *
 * @param {string} projectRoot - absolute path to the PSC's root directory
 * @param {string[]} plugins - paths to plugin files (`.ts` or `.js`)
 * @return {webpack.ProvidePlugin}
 */
function getPluginProviderPlugin(projectRoot, plugins) {
	return new (require('webpack').ProvidePlugin)(
		Object.fromEntries(
			plugins.map((pluginPath, index) => [
				'PLUGIN_' + index,
				path.resolve(projectRoot, pluginPath)
			])
		)
	);
}

/**
 * Runs the passed {@link webpack.Compiler} asynchronously, returning a Promise for its completion.
 *
 * @param {webpack.Compiler.Watching | webpack.Compiler | webpack.MultiWatching | webpack.MultiCompiler | *} compiler
 * @return {Promise<webpack.Compiler.Stats>} resolves with the `stats` on success and rejects on failure
 * (including if there's a compilation error)
 */
async function runWebpackCompilerAsync(compiler) {
	await new Promise((resolve, reject) => {
		compiler.run((err, res) => {
			if (err) {
				return reject(err);
			} else if (res.compilation.errors && res.compilation.errors.length) {
				return reject(new Error(res.compilation.errors.join('\n\n')));
			}
			if (res.compilation.warnings && res.compilation.warnings.length) {
				logger.warn('Compiled with warnings:');
				for (let warning of res.compilation.warnings) {
					console.warn(warning);
				}
			}
			resolve(res);
		});
	});
}

module.exports = compileElectronMainThread;
