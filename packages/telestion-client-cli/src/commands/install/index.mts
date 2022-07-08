// @ts-ignore
import { Argument, Command } from 'commander';

import { BaseWithPartial, CommandBuilder } from '../../model/index.mjs';
import { getLogger } from '../../lib/index.mjs';
import { InstallOptions, DependencyType } from './model.mjs';
import { runInstallCommand } from './command.mjs';

const logger = getLogger('Install Command');

export const installCommandBuilder: CommandBuilder = command => {
	command
		.command('install')
		.alias('in')
		.description('Installs a dependency to the Telestion Project')
		.addArgument(
			new Argument(
				'<type>',
				'The usage scope of the dependency you want to install'
			).choices(['prod', 'dev', 'electron'])
		)
		.addArgument(
			new Argument(
				'<dependencies...>',
				'The package names of the dependencies you want to install'
			)
		)
		.action(
			async (
				type: DependencyType,
				dependencies: string[],
				options: BaseWithPartial<InstallOptions>,
				actionCommand: Command
			) => {
				try {
					await runInstallCommand(type, dependencies, {
						...options,
						...actionCommand.optsWithGlobals()
					});
				} catch (err) {
					logger.error(err);
					process.exit(1);
				}
				process.exit(0);
			}
		);
};

export * from './model.mjs';
export * from './command.mjs';
