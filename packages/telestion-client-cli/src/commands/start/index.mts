// @ts-ignore
import { Command, Argument } from 'commander';

import { BaseWithPartial, CommandBuilder } from '../../model/index.mjs';
import { getLogger } from '../../lib/index.mjs';

import { StartOptions, defaultStartOptions } from './model.mjs';
import { hydrateStartOptions, runStartCommand } from './command.mjs';

const logger = getLogger('Start Command');

export const startCommandBuilder: CommandBuilder = command => {
	command
		.command('start')
		.alias('s')
		.description(
			'Start the development server for a Telestion Frontend Project, compiles the Electron main process and launches Electron'
		)
		.addArgument(
			new Argument(
				'target',
				'The output target the development server should use'
			)
				.choices(['electron', 'browser'])
				.default(defaultStartOptions.target)
				.argOptional()
		)
		.option(
			'-p, --port <port>',
			'Port of the development server to listen on',
			defaultStartOptions.port
		)
		.option(
			'--no-open',
			"Don't open the browser after the development server has started"
		)
		.action(
			async (
				target: 'electron' | 'browser',
				options: Omit<BaseWithPartial<StartOptions>, 'target' | 'port'> & {
					port: string;
				},
				actionCommand: Command
			) => {
				let errors: unknown[] = [];
				try {
					const hydrated = await hydrateStartOptions({
						...options,
						...actionCommand.optsWithGlobals(),
						target
					});
					await runStartCommand(hydrated);
				} catch (err) {
					errors.push(err);
				}

				if (errors.length > 0) {
					errors.forEach(error => logger.error(error));
					process.exit(1);
				}
			}
		);
};

export * from './model.mjs';
export * from './command.mjs';
export * as startStages from './stages.mjs';
