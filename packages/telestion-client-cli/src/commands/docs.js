const debug = require('debug')('docs');
const logger = require('../lib/logger')('docs');
const spawn = require('child_process').spawn;

// yargs def
const command = ['docs', 'd'];
const desc = 'Opens the Telestion Docs';

function builder(yargs) {
	return yargs;
}

async function handler(argv) {
	// gathering information
	debug('Arguments:', argv);

	let command = '';

	switch (process.platform) {
		case 'darwin':
			command = 'open';
			break;
		case 'win32':
			command = 'explorer.exe';
			break;
		case 'linux':
			command = 'xdg-open';
			break;
		default:
			throw new Error('Unsupported platform: ' + process.platform);
	}

	logger.info('Opening documentation in system browser');
	spawn(command, ['https://telestionteam.github.io/telestion-client/']);
	logger.success('Document opened successfully');
}

module.exports = {
	command,
	desc,
	builder,
	handler
};
