#!/usr/bin/env node
// @ts-ignore
import { Command, Option } from 'commander';
import {
	getPackageVersion,
	registerEventHandlers,
	setLogLevel
} from './lib/index.mjs';
import { builders } from './commands/index.mjs';

const program = new Command();
const version = getPackageVersion();

// exit cleanly on process signal events
registerEventHandlers();

program
	.name('tc-cli')
	.description(
		'The command line interface for the Telestion Client development'
	)
	.version(version);

// global options
// noinspection RequiredAttributes
program
	.addOption(
		new Option('--loglevel <level>', 'program log level')
			.choices(['debug', 'info', 'warn', 'error'])
			.default('warn')
	)
	.addOption(
		new Option('--working-dir <path>', 'alternative working directory').default(
			process.cwd()
		)
	);

// register sub-commands
builders.forEach(builder => builder(program));

// set log level as first step
program.hook('preAction', (thisCommand: any) => {
	setLogLevel(thisCommand.opts().loglevel);
});

// some help please
program
	.addHelpText(
		'afterAll',
		'\nFor more specific information, call the help for the sub-commands:\n' +
			'tc-cli <command> --help\n' +
			'Or check out our project page at https://telestion.wuespace.de/'
	)
	.showHelpAfterError('Specify --help for available options')
	.showSuggestionAfterError();

// parse argv
await program.parseAsync(process.argv);
