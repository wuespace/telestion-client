const openUrl = require('../lib/open-url');
const logger = require('../lib/logger')('docs');

// yargs def
const command = ['docs', 'd'];
const desc = 'Opens the Telestion Docs';

function builder(yargs) {
	return yargs;
}

async function handler(argv) {
	// gathering information
	logger.debug('Arguments:', argv);
	logger.info('Opening the documentation in the system browser');
	openUrl('https://wuespace.github.io/telestion-client/');
	logger.success('Document opened successfully');
}

module.exports = {
	command,
	desc,
	builder,
	handler
};
