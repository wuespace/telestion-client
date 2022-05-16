// @ts-ignore
import { Command } from 'commander';

import { BaseWithPartial, CommandBuilder } from '../../model/index.mjs';
import { getLogger } from '../../lib/index.mjs';

import { TemplateOptions, defaultTemplateOptions } from './model.mjs';
import { hydrateTemplateOptions, runTemplateCommand } from './command.mjs';

const logger = getLogger('Template Command');

export const templateCommandBuilder: CommandBuilder = command => {
	command
		.command('template')
		.alias('t')
		.description('Some really nice description')
		.argument('<required>', 'A really important argument')
		.argument('[optional]', 'A not so important argument')
		.option(
			'-t, --template-option <str>',
			'Description for this specific option',
			defaultTemplateOptions.someProp // default value
		)
		.action(
			async (
				required: string,
				optional: string,
				options: Omit<
					BaseWithPartial<TemplateOptions>,
					'required' | 'optional'
				>,
				actionCommand: Command
			) => {
				let errors: unknown[] = [];
				try {
					const hydrated = await hydrateTemplateOptions({
						...options,
						...actionCommand.optsWithGlobals(),
						required,
						optional
					});
					errors = await runTemplateCommand(hydrated);
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
export * as templateStages from './stages.mjs';
