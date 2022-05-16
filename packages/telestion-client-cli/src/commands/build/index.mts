// @ts-ignore
import { Command, Option } from 'commander';

import { BaseWithPartial, CommandBuilder } from '../../model/index.mjs';
import { getLogger } from '../../lib/index.mjs';

import {
	BuildOptions,
	defaultBuildOptions,
	possibleArchitectures,
	possiblePlatforms
} from './model.mjs';
import { hydrateBuildOptions, runBuildCommand } from './command.mjs';

const logger = getLogger('Build Command');

export const buildCommandBuilder: CommandBuilder = command => {
	command
		.command('build')
		.alias('b')
		.description('Builds a Telestion Frontend Project for different platforms')
		.addOption(
			new Option(
				'--platform <platform...>',
				'A list of platform to build the PSC for'
			)
				.choices(possiblePlatforms)
				.default(defaultBuildOptions.platform)
		)
		.addOption(
			new Option(
				'--arch <arch...>',
				'A list of architectures to build the PSC for'
			)
				.choices(possibleArchitectures)
				.default(defaultBuildOptions.arch)
		)
		.action(
			async (
				options: BaseWithPartial<BuildOptions>,
				actionCommand: Command
			) => {
				let errors: unknown[] = [];
				try {
					const hydrated = await hydrateBuildOptions({
						...options,
						...actionCommand.optsWithGlobals()
					});
					errors = await runBuildCommand(hydrated);
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
export * as buildStages from './stages.mjs';
