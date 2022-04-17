// @ts-ignore
import { Command } from 'commander';

import { BaseWithPartial, CommandBuilder } from '../../model/index.mjs';
import { getLogger } from '../../lib/index.mjs';

import { defaultOptions, InitOptions } from './model.mjs';
import { init, hydrate } from './command.mjs';

const logger = getLogger('Init Command');

export const build: CommandBuilder = command => {
	command
		.command('init')
		.alias('i')
		.description('Initializes a new Telestion Frontend Project')
		.argument('[name]', 'The name of your new Telestion Frontend Project')
		.option(
			'-t, --template <name>',
			'Package name of the template module',
			defaultOptions.template
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
					const hydrated = await hydrate({
						...options,
						...actionCommand.optsWithGlobals(),
						name
					});
					errors = await init(hydrated);
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
