const debug = require('debug')('generate');
const logger = require('../lib/logger')('generate');

// yargs def
const command = ['generate <component> [name]', 'g'];
const desc = 'Adds a new component to an existing Telestion Frontend Project';

function builder(yargs) {
	return yargs
		.option('component', {
			alias: 'c',
			describe: 'The component type to add',
			type: 'string'
		})
		.option('name', {
			alias: 'n',
			describe: 'The new component name',
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
