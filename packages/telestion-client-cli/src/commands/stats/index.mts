// @ts-ignore
import { Command } from 'commander';

import { BaseWithPartial, CommandBuilder } from '../../model/index.mjs';
import { getLogger } from '../../lib/index.mjs';

import { StatsOptions, defaultOptions } from './model.mjs';
import { hydrate, run } from './command.mjs';

const logger = getLogger('Stats Command');

export const build: CommandBuilder = command => {
	command
		.command('stats')
		.description(
			'Displays some interesting stats around a Telestion Frontend project'
		)
		.option('--json', 'Output the statistics as JSON', defaultOptions.json)
		.action(
			async (
				options: Omit<BaseWithPartial<StatsOptions>, 'required' | 'optional'>,
				actionCommand: Command
			) => {
				let errors: unknown[] = [];
				try {
					const hydrated = await hydrate({
						...options,
						...actionCommand.optsWithGlobals()
					});
					errors = await run(hydrated);
				} catch (err) {
					errors.push(err);
				}

				if (errors.length > 0) {
					errors.forEach(error => logger.error(error));
					process.exit(1);
				}
				process.exit(0);
			}
		);
};
