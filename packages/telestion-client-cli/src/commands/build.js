const debug = require('debug')('build');
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
