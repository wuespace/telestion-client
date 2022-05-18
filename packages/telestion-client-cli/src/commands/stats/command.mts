import { join } from 'node:path';
import chalk from 'chalk';
import inquirer from 'inquirer';

import { BaseWithPartial } from '../../model/index.mjs';
import {
	getDependencies,
	getLogger,
	getName,
	getVersion
} from '../../lib/index.mjs';

import { StatsOptions } from './model.mjs';
import { getPackageJson, getPSCRoot, getWidgets } from '../../actions/psc.mjs';
import { hasWorkspaceTag } from '../../actions/workspace.mjs';

const logger = getLogger('Stats');

/**
 * The actual command.
 * @param options - the complete options set
 */
export async function runStatsCommand(
	options: StatsOptions
): Promise<unknown[]> {
	const errors: unknown[] = [];
	logger.debug('Received options:', options);

	const projectDir = await getPSCRoot(options.workingDir);
	const packageJson = await getPackageJson(projectDir);

	const pscName = await getName(packageJson);
	const pscVersion = await getVersion(packageJson);
	const pscDependencies = await getDependencies(packageJson);
	logger.debug('Scraped infos:', { pscName, pscVersion, pscDependencies });

	const widgets = await getWidgets(projectDir);
	logger.debug('Installed widgets:', widgets);

	const hasWorkspaceDependencies = await hasWorkspaceTag(projectDir);
	logger.debug('Has Workspace tag:', hasWorkspaceDependencies);

	if (options.json) {
		const packed = {
			name: pscName,
			version: pscVersion,
			dependencies: Object.keys(pscDependencies),
			widgets,
			hasWorkspaceDependencies
		};

		console.log(JSON.stringify(packed, null, 2));
	} else {
		const workspaceDependenciesOutput = hasWorkspaceDependencies
			? `
${chalk.yellow(
	'Attention: Your project contains linked workspace dependencies.'
)}`
			: '';

		console.log(`
Statistics for the Telestion PSC ${chalk.green(
			pscName ?? 'Anonymous'
		)} @ ${chalk.magenta(pscVersion ?? 'unknown')}:

Dependencies (${chalk.yellow(Object.keys(pscDependencies).length)}):
${Object.keys(pscDependencies)
	.map(dependency => `  - ${chalk.grey(dependency)}`)
	.join('\n')}

Widgets (${chalk.yellow(widgets.length)}):
${widgets.map(widget => `  - ${chalk.cyan(widget)}`).join('\n')}

Project path: ${chalk.yellow(projectDir)}
Widget path:  ${chalk.yellow(join(projectDir, 'src', 'widgets'))}
${workspaceDependenciesOutput}
`);
	}

	return errors;
}

/**
 * Asks the user some questions on some missing parts in the current options set.
 * @param options - the current options set (does not have to be complete)
 */
export async function hydrateStatsOptions(
	options: BaseWithPartial<StatsOptions>
): Promise<StatsOptions> {
	return inquirer.prompt<StatsOptions>(
		[
			{
				type: 'confirm',
				name: 'json',
				message: 'Show the output in JSON format?'
			}
		],
		options
	);
}
