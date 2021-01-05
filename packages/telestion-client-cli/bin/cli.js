#!/usr/bin/env node

'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
	console.error(err);
	throw err;
});

const yargs = require('yargs');
const debug = require('debug')('cli');
require('../src/lib/checkExternalDependencies')(['git', 'npm']);

debug('Build yargs parser');
// noinspection JSUnresolvedFunction
yargs
	.scriptName('tc-cli')
	.commandDir('../src/commands')
	.epilog(
		'For more specific information, call the help for the sub-commands:\n' +
			'$0 <command> --help\n' +
			'Or check out our project page at https://telestion.wuespace.de/'
	)
	.demandCommand()
	.recommendCommands()
	.showHelpOnFail(false, 'Specify --help for available options')
	.help()
	.parse();
