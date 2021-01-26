const electroner = require('electroner');

const debug = require('debug')('start');
const logger = require('../lib/logger')('start');

// yargs def
const command = ['start', 's'];
const desc = 'Start the development server for a Telestion Frontend Project';

function builder(yargs) {
	return yargs.option('electron', {
		alias: 'e',
		describe: 'Build and start an electron app instead',
		type: 'boolean'
	});
}

async function handler(argv) {
	// dynamically load dependencies
	const Webpack = require('webpack');
	const { createWebpackDevConfig } = require('@craco/craco');
	const WebpackDevServer = require('webpack-dev-server');

	// gathering information
	debug('Arguments:', argv);

	const webpackConfig = createWebpackDevConfig({
		webpack: { configure: { stats: 'errors-only' } }
	});

	const compiler = Webpack(webpackConfig);
	const devServerOptions = Object.assign({}, webpackConfig.devServer, {
		open: false,
		transportMode: 'ws'
	});
	const server = new WebpackDevServer(compiler, devServerOptions);

	server.listen(3000, '127.0.0.1', () => {
		electroner('http://localhost:3000', {});
		logger.info('Webpack dev server listening on http://localhost:3000');
	});
}

module.exports = {
	command,
	desc,
	builder,
	handler
};
