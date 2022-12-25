// @ts-ignore
import { Argument, Command } from 'commander';
import { BaseWithPartial, CommandBuilder } from '../../model/index.mjs';
import { getLogger } from '../../lib/index.mjs';
import { GenerateOptions } from './model.mjs';
import { hydrateGenerateOptions, runGenerateCommand } from './command.mjs';
import { generatorNames } from './generators/index.mjs';

const logger = getLogger('Generate Command');

export const generateCommandBuilder: CommandBuilder = command => {
	command
		.command('generate')
		.alias('g')
		.description('Generate various files for your project')
		.addArgument(
			new Argument('[generator]', 'The type of file to generate').choices(
				generatorNames()
			)
		)
		.argument('[name]', 'The name of the file to generate')
		.action(
			async (
				generator: string,
				name: string,
				options: Omit<BaseWithPartial<GenerateOptions>, 'generator' | 'name'>,
				actionCommand: Command
			) => {
				let errors: unknown[] = [];
				try {
					const hydrated = await hydrateGenerateOptions({
						...options,
						...actionCommand.optsWithGlobals(),
						generator,
						name
					});
					errors = await runGenerateCommand(hydrated);
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
export * from './generators/index.mjs';
