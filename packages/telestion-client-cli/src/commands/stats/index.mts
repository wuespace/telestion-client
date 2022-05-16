// @ts-ignore
import { Command } from 'commander';

import { BaseWithPartial, CommandBuilder } from '../../model/index.mjs';
import { getLogger } from '../../lib/index.mjs';

import { StatsOptions, defaultStatsOptions } from './model.mjs';
import { hydrateStatsOptions, runStatsCommand } from './command.mjs';

const logger = getLogger('Stats Command');

export const statsCommandBuilder: CommandBuilder = command => {
	command
		.command('stats')
		.description(
			'Displays some interesting stats around a Telestion Frontend project'
		)
		.option('--json', 'Output the statistics as JSON', defaultStatsOptions.json)
		.action(
			async (
				options: BaseWithPartial<StatsOptions>,
				actionCommand: Command
			) => {
				let errors: unknown[] = [];
				try {
					const hydrated = await hydrateStatsOptions({
						...options,
						...actionCommand.optsWithGlobals()
					});
					errors = await runStatsCommand(hydrated);
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

export * from './model.mjs';
export * from './command.mjs';
