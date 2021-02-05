const openUrl = require('../lib/open-url');
const debug = require('debug')('docs');
const logger = require('../lib/logger')('docs');

// yargs def
const command = ['docs', 'd'];
const desc = 'Opens the Telestion Docs';

function builder(yargs) {
	return yargs;
}

async function handler(argv) {
	// gathering information
	debug('Arguments:', argv);
	logger.info('Opening documentation in system browser');
	openUrl('https://telestionteam.github.io/telestion-client/');
	logger.success('Document opened successfully');
}

module.exports = {
	command,
	desc,
	builder,
	handler
};
