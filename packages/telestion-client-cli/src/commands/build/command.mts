import inquirer from 'inquirer';

import { BaseWithPartial } from '../../model/index.mjs';
import { getLogger } from '../../lib/index.mjs';

import {
	BuildOptions,
	defaultBuildOptions,
	possibleArchitectures,
	possiblePlatforms
} from './model.mjs';
import {
	buildStage,
	electronInstallStage,
	electronPackageStage
} from './stages.mjs';
import { getPackageJson, getPSCRoot } from '../../actions/psc.mjs';
import { hasWorkspaceTag } from '../../actions/workspace.mjs';
import {
	ArchOption,
	PlatformOption
} from '../../actions/electron-packager.mjs';

const logger = getLogger('Build');

/**
 * The actual command.
 * @param options - the complete options set
 */
export async function runBuildCommand(
	options: BuildOptions
): Promise<unknown[]> {
	const errors: unknown[] = [];
	logger.debug('Received options:', options);

	const platform = options.platform.filter(
		current => current !== null
	) as PlatformOption[];
	const arch = options.arch.filter(current => current !== null) as ArchOption[];

	if (platform.length === 0) {
		throw new Error('Sorry, your current build platform is not supported');
	}

	if (arch.length === 0) {
		throw new Error('Sorry, your current build architecture is not supported');
	}

	const projectDir = await getPSCRoot(options.workingDir);
	const packageJson = await getPackageJson(projectDir);

	if (await hasWorkspaceTag(projectDir)) {
		throw new Error('Sorry, projects with workspace links cannot be packaged.');
	}

	await buildStage(projectDir);
	await electronInstallStage(projectDir, packageJson);
	await electronPackageStage(projectDir, { platform, arch });

	return errors;
}

/**
 * Asks the user some questions on some missing parts in the current options set.
 * @param options - the current options set (does not have to be complete)
 */
export async function hydrateBuildOptions(
	options: BaseWithPartial<BuildOptions>
): Promise<BuildOptions> {
	return inquirer.prompt<BuildOptions>(
		[
			{
				type: 'checkbox',
				name: 'platform',
				message: 'For which platforms you want to build the PSC?',
				choices: possiblePlatforms,
				default: defaultBuildOptions.platform
			},
			{
				type: 'checkbox',
				name: 'arch',
				message: 'For which architectures you want to build the PSC?',
				choices: possibleArchitectures,
				default: defaultBuildOptions.arch
			}
		],
		options
	);
}
