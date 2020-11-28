const debug = require('debug')('start');
const logger = require('../lib/logger')('start');

// yargs def
const command = ['start', 's'];
const desc = 'Start the development server for a Telestion Frontend Project';

function builder(yargs) {
	return yargs
		.option('electron', {
			alias: 'e',
			describe: 'Build and start an electron app instead',
			type: 'boolean'
		});
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
