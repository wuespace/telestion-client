const path = require('path');
const getConfig = require('./get-config');
const logger = require('./logger')('cli-preparations');

/**
 * Searches for a Telestion Client configuration file (e.g., `telestion.config.js`, `.telestionrc.js`, or
 * `"telestion"` entry in the `package.json`).
 *
 * When it finds it, it changes the `process.cwd()` to the PSC's root directory (i.e., the folder that contains the
 * config file).
 *
 * @return {Promise<{projectRoot: string, config: *}>} Promise that resolves with
 * - the `projectRoot`, the path to the root directory of the PSC (containing `src`, `package.json`, and so on
 * - the `config`, the contents of the discovered Telestion Client configuration file
 *
 * Rejects if no configuration file can be found in the current CWD and directories above.
 */
async function prepareEnvironment() {
	logger.info('Reading configuration');
	const config = await getConfig();
	logger.success('Found configuration file at: ' + config['filepath']);
	logger.debug('Config', config);

	let projectRoot = path.dirname(config['filepath']);
	process.chdir(projectRoot);
	return { config: config['config'], projectRoot };
}

module.exports = prepareEnvironment;
