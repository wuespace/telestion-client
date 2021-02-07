const path = require('path');
const getConfig = require('../lib/config');
const compileElectronMainThread = require('../lib/build/compile-electron-main-thread');
const compileReactApp = require('../lib/build/compile-react-app');
const withAdjustedPackageJsonRun = require('../lib/build/with-adjusted-package-json-run');
const packageElectronApp = require('../lib/build/package-electron-app');
const logger = require('../lib/logger')('build');

// yargs def
const command = ['build [platform]', 'b'];
const desc = 'Builds a Telestion Frontend Project for different platforms';

function builder(yargs) {
	return yargs.option('platform', {
		alias: 'p',
		describe: 'Platform to build for',
		type: 'array'
	});
}

async function handler(argv) {
	try {
		logger.info('Reading configuration');
		const config = await getConfig();
		logger.success('Found configuration file at: ' + config.filepath);
		logger.debug('Config', config);

		let projectRoot = path.dirname(config.filepath);
		process.chdir(projectRoot);
		logger.debug('Arguments:', argv);

		logger.info('Compiling PSC React app');
		await compileReactApp();
		logger.success('React build complete.');

		logger.info('Compiling PSC at', projectRoot);

		logger.info('Compiling Electron main thread');
		await compileElectronMainThread(projectRoot);
		logger.success('Electron main thread has been compiled successfully.');

		logger.info('Packaging Electron app');
		await withAdjustedPackageJsonRun(projectRoot, () => packageElectronApp());
		logger.success('Electron app has been packaged successfully.');
	} catch (e) {
		logger.error(
			'An error has occurred during the build process. Details:',
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
