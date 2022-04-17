const prepareEnvironment = require('./prepare-environment');

/**
 * Runs a set of code with `process.cwd()` being the PSC's root directory, containing `package.json`, `src`, `node_modules`, etc.
 *
 * @param {function(config: *, projectRoot: string): Promise<*>} cb - the callback that gets run within the PSC root directory
 * @param {string} processName - the process name, used for error messages
 * @return {Promise<*>} The return value of `cb`
 */
async function runInPscProjectDir(cb, processName) {
	try {
		let { config, projectRoot } = await prepareEnvironment();
		return await cb(config, projectRoot);
	} catch (e) {
		const logger = require('./logger')(processName);
		logger.error(
			`An error has occurred during the ${processName} process. Details:`,
			'\n',
			e.message
		);
		logger.debug(e.stackTrace);
		process.exit(1);
	}
}

module.exports = runInPscProjectDir;
