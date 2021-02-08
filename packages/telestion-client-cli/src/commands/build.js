const compileElectronMainThread = require('../lib/build/compile-electron-main-thread');
const compileReactApp = require('../lib/build/compile-react-app');
const withAdjustedPackageJsonRun = require('../lib/build/with-adjusted-package-json-run');
const packageElectronApp = require('../lib/build/package-electron-app');
const prepareEnvironment = require('../lib/prepare-environment');
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

async function handler() {
	try {
		let { config, projectRoot } = await prepareEnvironment();

		logger.info('Compiling PSC React app');
		await compileReactApp();
		logger.success('React build complete.');

		logger.info('Compiling PSC at', projectRoot);

		logger.info('Compiling Electron main thread');
		await compileElectronMainThread(projectRoot, config?.plugins || []);
		logger.success('Electron main thread has been compiled successfully.');

		logger.info('Packaging Electron app');
		/**
		 * @type {string[]}
		 */
		const files = await withAdjustedPackageJsonRun(
			projectRoot,
			async () => await packageElectronApp()
		);
		logger.info(
			'Generated files:',
			'\n' + files.map(file => `- ${file}`).join('\n')
		);
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
