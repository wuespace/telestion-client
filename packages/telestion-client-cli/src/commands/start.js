const path = require('path');
const runElectron = require('electroner');
const openUrl = require('../lib/open-url');
const getConfig = require('../lib/config');
const compileElectronMainThread = require('../lib/build/compile-electron-main-thread');

const logger = require('../lib/logger')('start');

// yargs def
const command = ['start', 's'];
const desc = 'Start the development server for a Telestion Frontend Project';

function builder(yargs) {
	return yargs
		.option('electron', {
			alias: 'e',
			describe: 'Start as an electron app',
			boolean: true,
			conflicts: 'browser'
		})
		.option('browser', {
			alias: 'b',
			describe: 'Run in browser',
			boolean: true,
			conflicts: 'electron'
		});
}

async function handler(argv) {
	try {
		logger.info('Reading configuration');
		const config = await getConfig();
		logger.success('Found configuration file at: ' + config['filepath']);
		logger.debug('Config', config);

		let projectRoot = path.dirname(config['filepath']);
		process.chdir(projectRoot);

		// dynamically load dependencies
		const { start } = require('@craco/craco/lib/cra');

		// Disable the PREFLIGHT_CHECK as react-scripts, otherwise, aborts warning about multiple webpack versions.
		process.env.SKIP_PREFLIGHT_CHECK = 'true';
		// Disable opening the app in the Browser. We'll do that manually, should it come to that.
		process.env.BROWSER = 'none';
		start({
			// craco config
			reactScriptsVersion: 'react-scripts'
		}); // runs asynchronously

		if (argv.browser) openUrl('http://localhost:3000');
		else if (argv.electron) {
			logger.info('Compiling Electron main thread');
			await compileElectronMainThread(
				projectRoot,
				config.config?.plugins || [],
				false
			);
			logger.success('Electron main thread has been compiled successfully.');
			runElectron(path.join(projectRoot, 'build', 'electron.js'), {}, () => {
				process.exit(0);
			});
		}
	} catch (e) {
		logger.error(
			'An error has occurred during the start process. Details:',
			'\n',
			e.message
		);
		logger.debug(e.stackTrace);
		process.exit(1);
	}
}

module.exports = {
	command,
	desc,
	builder,
	handler
};
