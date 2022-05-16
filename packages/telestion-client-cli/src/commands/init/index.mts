// @ts-ignore
import { Command } from 'commander';

import { BaseWithPartial, CommandBuilder } from '../../model/index.mjs';
import { getLogger } from '../../lib/index.mjs';

import { defaultInitOptions, InitOptions } from './model.mjs';
import { runInitCommand, hydrateInitOptions } from './command.mjs';

const logger = getLogger('Init Command');

export const initCommandBuilder: CommandBuilder = command => {
	command
		.command('init')
		.alias('i')
		.description('Initializes a new Telestion Frontend Project')
		.argument('[name]', 'The name of your new Telestion Frontend Project')
		.option(
			'-t, --template <name>',
			'Package name of the template module',
			defaultInitOptions.template
		)
		.option(
			'-g, --no-init-git',
			'Skip creating a git repository in the Frontend Project directory'
		)
		.option(
			'-i, --no-install',
			'Skip installing production and development dependencies with pnpm'
		)
		.option(
			'-c, --no-commit',
			'Skip adding the changes to the git staging list and committing them'
		)
		.option(
			'-u, --git-username',
			"The git username that is used in commits, in case it isn't set globally"
		)
		.option(
			'-e, --git-email',
			"The git email address that is used in commits, in case it isn't set globally"
		)
		.action(
			async (
				name: string,
				options: Omit<BaseWithPartial<InitOptions>, 'name'>,
				actionCommand: Command
			) => {
				let errors: unknown[] = [];
				try {
					const hydrated = await hydrateInitOptions({
						...options,
						...actionCommand.optsWithGlobals(),
						name
					});
					errors = await runInitCommand(hydrated);
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
export * as initStages from './stages.mjs';
