// @ts-ignore
import { Command } from 'commander';

import { BaseWithPartial, CommandBuilder } from '../../model/index.mjs';
import { getLogger } from '../../lib/index.mjs';

import { CommandOptions, defaultOptions } from './model.mjs';
import { hydrate, run } from './command.mjs';

const logger = getLogger('Template Command');

export const build: CommandBuilder = command => {
	command
		.command('template')
		.alias('t')
		.description('Some really nice description')
		.argument('<required>', 'A really important argument')
		.argument('[optional]', 'A not so important argument')
		.option(
			'-t, --template-option <str>',
			'Description for this specific option',
			defaultOptions.someProp // default value
		)
		.action(
			async (
				required: string,
				optional: string,
				options: Omit<BaseWithPartial<CommandOptions>, 'required' | 'optional'>,
				actionCommand: Command
			) => {
				let errors: unknown[] = [];
				try {
					const hydrated = await hydrate({
						...options,
						...actionCommand.optsWithGlobals(),
						required,
						optional
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
