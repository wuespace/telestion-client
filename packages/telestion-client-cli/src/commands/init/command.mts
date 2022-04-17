import chalk from 'chalk';
import inquirer from 'inquirer';
import { basename } from 'path';

import { BaseWithPartial } from '../../model/index.mjs';
import { getLogger } from '../../lib/index.mjs';

import { InitOptions, defaultOptions } from './model.mjs';
import {
	depInstallStage,
	gitCommitStage,
	gitInitStage,
	informationStage,
	packageLinkStage,
	pnpmInstallStage,
	templateStage
} from './stages.mjs';

const logger = getLogger('Init');

/**
 * The actual init command.
 *
 * It creates and initializes a new Telestion Frontend Project.
 *
 * @param options - the options to set up the initialization workflow
 */
export async function init(options: InitOptions): Promise<unknown[]> {
	const errors: unknown[] = [];
	logger.debug('Received options:', options);

	// stages
	const infos = await informationStage(options);
	const isPnpmInstalled = await pnpmInstallStage(errors);
	const templateInfos = await templateStage(options, infos);
	const isGloballyLinked = await packageLinkStage(
		templateInfos.workspaceDependencies,
		templateInfos.templatePackagePath,
		errors
	);
	const isInitialized = await gitInitStage(options, infos, errors);
	const isDepInstalled = await depInstallStage(
		options,
		infos,
		templateInfos.workspaceDependencies,
		isPnpmInstalled,
		errors
	);
	const isCommitted = await gitCommitStage(
		options,
		infos,
		isInitialized,
		errors
	);

	logger.info('Final state:', {
		infos,
		isPnpmInstalled,
		templateInfos,
		isGloballyLinked,
		isInitialized,
		isDepInstalled,
		isCommitted
	});

	const errorNotice = `
${chalk.red('Notice:')}
  Some errors occurred during the project initialization.
  Please take a look at them below.
`;

	console.log(`
Your Telestion Frontend Project ${chalk.magenta(
		options.name
	)} has been successfully installed to:

  ${chalk.yellow(infos.projectPath)}

Go into the project directory:

  ${chalk.magenta(`cd ${basename(infos.projectPath)}`)}

And start to develop with:

  ${chalk.magenta('pnpm start')}

${chalk.blue('Telestion')} wishes you happy hacking!
${errors.length > 0 ? errorNotice : ''}`);

	return errors;
}

/**
 * Asks the user some questions on some missing parts in the current options set.
 * @param options - the current options set (does not have to be complete)
 */
export async function hydrate(
	options: BaseWithPartial<InitOptions>
): Promise<InitOptions> {
	return inquirer.prompt<InitOptions>(
		[
			{
				type: 'input',
				name: 'name',
				message: "What's the name of your new project?"
			},
			{
				type: 'input',
				name: 'template',
				message: 'Which template should be used? (package name)',
				default: defaultOptions.template
			},
			{
				type: 'confirm',
				name: 'initGit',
				message: 'Should this command create a new git repository?',
				default: defaultOptions.initGit
			},
			{
				type: 'confirm',
				name: 'install',
				message: 'Should this command install dependencies with PNPM?',
				default: defaultOptions.install
			},
			{
				type: 'confirm',
				name: 'commit',
				message: 'Should this command commit the made changes afterwards?',
				default: defaultOptions.commit
			}
		],
		options
	);
}
