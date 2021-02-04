const debug = require('debug')('generate');
const logger = require('../lib/logger')('generate');
const generateWidget = require('../lib/generate/widget');

// yargs def
const command = ['generate <component> <name>', 'g'];
const desc = 'Adds a new component to an existing Telestion Frontend Project';

function builder(yargs) {
	return yargs
		.positional('component', {
			describe: 'The component type to add',
			type: 'string'
		})
		.positional('name', {
			describe: 'The new component name',
			type: 'string'
		});
}

async function handler(argv) {
	// gathering information
	debug('Arguments:', argv);

	// for implementation examples, look at the @server-state/cli refactoring branch
	if (argv['component'] === 'widget' || argv['component'] === 'w') {
		generateWidget(argv);
	} else {
		logger.error('Invalid component type. Can only generate "widget".');
		process.exit(1);
	}
}

module.exports = {
	command,
	desc,
	builder,
	handler
};
