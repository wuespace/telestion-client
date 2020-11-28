const debug = require('debug')('doc');
const logger = require('../lib/logger')('doc');

// yargs def
const command = ['docs [keyword]', 'd'];
const desc = 'Opens the Telestion Docs and optionally searches for a keyword';

function builder(yargs) {
	return yargs
		.option('keyword', {
			alias: 'k',
			describe: 'A doc keyword to search for',
			type: 'string'
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
