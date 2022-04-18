import { join } from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

import { BaseWithPartial } from '../../model/index.mjs';
import {
	getDependencies,
	getLogger,
	getName,
	getVersion,
	readFile
} from '../../lib/index.mjs';

import { StatsOptions } from './model.mjs';
import { getPSCRoot, getWidgets } from '../../actions/psc.mjs';

const logger = getLogger('Stats');

/**
 * The actual command.
 * @param options - the complete options set
 */
export async function run(options: StatsOptions): Promise<unknown[]> {
	const errors: unknown[] = [];
	logger.debug('Received options:', options);

	const pscRootPath = await getPSCRoot(options.workingDir);
	logger.debug('Found PSC Root:', pscRootPath);
	if (!pscRootPath) {
		throw new Error('You are not in a Telestion Frontend Project');
	}

	const packageJson = JSON.parse(
		await readFile(join(pscRootPath, 'package.json'))
	) as Record<string, unknown>;
	logger.debug('PSC package.json:', packageJson);

	const pscName = await getName(packageJson);
	const pscVersion = await getVersion(packageJson);
	const pscDependencies = await getDependencies(packageJson);
	logger.debug('Scraped infos:', { pscName, pscVersion, pscDependencies });

	const widgets = await getWidgets(pscRootPath);
	logger.debug('Installed widgets:', widgets);

	if (options.json) {
		const packed = {
			name: pscName,
			version: pscVersion,
			dependencies: Object.keys(pscDependencies),
			widgets
		};

		console.log(JSON.stringify(packed, null, 2));
	} else {
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

Project path: ${chalk.yellow(pscRootPath)}
Widget path:  ${chalk.yellow(join(pscRootPath, 'src', 'widgets'))}
`);
	}

	return errors;
}

/**
 * Asks the user some questions on some missing parts in the current options set.
 * @param options - the current options set (does not have to be complete)
 */
export async function hydrate(
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
