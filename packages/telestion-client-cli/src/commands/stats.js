const debug = require('debug')('stats');
const logger = require('../lib/logger')('stats');

// yargs def
const command = ['stats', 't'];
const desc =
	'Displays some interesting stats around a Telestion Frontend project';

function builder(yargs) {
	return yargs;
}

async function handler(argv) {
	// gathering information
	debug('Arguments:', argv);

	// for implementation examples, look at the @server-state/cli refactoring branch
	logger.error('Not implemented');
	process.exit(1);
}

module.exports = {
	command,
	desc,
	builder,
	handler
};
