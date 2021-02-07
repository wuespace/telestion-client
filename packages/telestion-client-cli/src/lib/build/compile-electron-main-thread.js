const path = require('path');
const logger = require('../logger')('electron-thread-build');

async function compileElectronMainThread(projectRoot) {
	const webpack = require('webpack');
	const webpackConfig = buildWebpackConfig(projectRoot);
	const compiler = webpack(webpackConfig);
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

/**
 * Creates a webpack config for compiling the Electron Main Process
 *
 * @param {string} projectRoot - the PSC root directory's path
 * @return {webpack.Configuration}
 */
function buildWebpackConfig(projectRoot) {
	return {
		entry: require.resolve('./static/electron-main.js'),
		mode: 'production',
		target: 'node',
		stats: 'errors-warnings',
		output: {
			path: path.join(projectRoot, 'build'),
			filename: 'electron.js',
			libraryTarget: 'commonjs2'
		},
		node: false,
		externals: { electron: 'electron' },
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: require.resolve('ts-loader'),
					exclude: /node_modules/
				}
			]
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js']
		}
	};
}

module.exports = compileElectronMainThread;
