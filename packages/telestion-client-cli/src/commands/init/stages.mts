import { dirname, join } from 'path';
import ora from 'ora';
import { TreeElement } from '@fliegwerk/dir-tree';

import {
	getLogger,
	lastAtLeast,
	normalizeProjectName,
	readDir,
	wait
} from '../../lib/index.mjs';
import { getProjectPath } from '../../actions/telestion-project.mjs';
import {
	installPnpm,
	pnpmInstall,
	pnpmLinkFromGlobal,
	pnpmLinkToGlobal
} from '../../actions/pnpm.mjs';
import {
	getTemplateDirTree,
	getTemplateInformation,
	getTemplateReplacers,
	processTemplateTree,
	TemplateInformation
} from '../../actions/template.mjs';
import {
	isGitInstalled,
	gitSetup,
	gitInit,
	gitAdd,
	gitCommit
} from '../../actions/git.mjs';

import { InitOptions } from './model.mjs';
import { createWorkspaceTag } from '../../actions/workspace.mjs';

const logger = getLogger('Init Stage');

export interface Information {
	projectPath: string;
	projectName: string;
	isProject: boolean;
}

export async function informationStage(
	options: InitOptions
): Promise<Information> {
	const spinner = ora('Gathering information');

	if (options.name.trim().length === 0) {
		throw new Error('Name is empty');
	}

	const projectName = await normalizeProjectName(options.name);
	logger.info('Normalized project name:', projectName);

	let result: { projectPath: string; isProject: boolean };
	try {
		spinner.start();
		result = await getProjectPath(options.workingDir, projectName);
	} catch (err) {
		spinner.fail('Cannot gather needed information');
		throw err;
	}

	spinner.succeed('Gathered information');
	if (result.isProject) ora('Found Telestion Project').info();

	logger.info('Project path:', result.projectPath);
	logger.info('Is Telestion Project:', result.isProject);
	return { ...result, projectName };
}

export async function pnpmInstallStage(errors: unknown[]): Promise<boolean> {
	const spinner = ora('Install pnpm');

	try {
		spinner.start();
		await installPnpm();
	} catch (err) {
		spinner.warn('Cannot install PNPM');
		errors.push(err);
		return false;
	}

	spinner.succeed('PNPM installed');
	return true;
}

export async function templateStage(
	options: InitOptions,
	infos: Information
): Promise<TemplateInformation> {
	const spinner = ora('Retrieve template information');

	let templateInfos: TemplateInformation;
	try {
		spinner.start();
		templateInfos = await getTemplateInformation(options.template);
		logger.info('Template information:', templateInfos);
	} catch (err) {
		spinner.fail(`Cannot retrieve template information`);
		throw err;
	}

	if (templateInfos.workspaceDependencies.length > 0) {
		spinner.stop();
		ora('Workspace dependencies detected').info();
		spinner.start();
	}

	let tree: TreeElement;
	try {
		spinner.text = 'Parse template source tree';
		tree = await lastAtLeast(
			1000,
			getTemplateDirTree(templateInfos.templatePath)
		);
		logger.info('Parsed template tree:', tree);
	} catch (err) {
		spinner.fail('Cannot parse template source tree');
		throw err;
	}

	const replacers = await getTemplateReplacers(
		options.name,
		infos.projectName,
		templateInfos.dependencies,
		templateInfos.devDependencies,
		templateInfos.electronDependencies
	);
	logger.debug('Generated replacers:', replacers);

	try {
		spinner.text = 'Create new project from template';
		await lastAtLeast(
			2000,
			processTemplateTree(tree, infos.projectPath, replacers)
		);
		logger.info('Processed template tree');
	} catch (err) {
		spinner.fail('Cannot create new project from template');
		throw err;
	}

	if (templateInfos.workspaceDependencies.length > 0) {
		logger.debug('Workspace dependencies found. Create workspace tag');
		await createWorkspaceTag(infos.projectPath);
	}

	spinner.succeed('Created Frontend Project');
	return templateInfos;
}

export async function packageLinkStage(
	workspaceDependencies: string[],
	templatePackagePath: string,
	errors: unknown[]
): Promise<boolean> {
	// do nothing if no workspace dependencies exist
	if (workspaceDependencies.length === 0) return true;

	const spinner = ora('Find available workspace dependencies');

	const strippedWorkspaceDependencies = workspaceDependencies.map(
		dependency => dependency.split('/').at(-1) as string
	);
	logger.debug(
		'Stripped workspace dependencies:',
		strippedWorkspaceDependencies
	);

	const templatePackageParentDir = dirname(templatePackagePath);
	logger.debug('Template package parent directory:', templatePackageParentDir);

	let availablePackages: string[];
	try {
		spinner.start();
		availablePackages = await readDir(templatePackageParentDir);
		logger.debug('Available packages:', availablePackages);
	} catch (err) {
		spinner.warn(
			'Cannot read parent directory of template package (readdir failed)'
		);
		errors.push(err);
		return false;
	}

	const linkedPackages = strippedWorkspaceDependencies.filter(dependency =>
		availablePackages.includes(dependency)
	);
	const missingPackages = strippedWorkspaceDependencies.filter(
		dependency => !availablePackages.includes(dependency)
	);
	logger.debug('Linked packages:', linkedPackages);
	logger.debug('Missing packages:', missingPackages);

	for (const linkedPackage of linkedPackages) {
		spinner.text = 'Link matching workspace dependencies globally';
		const linkErrors: unknown[] = [];

		try {
			const packagePath = join(templatePackageParentDir, linkedPackage);
			logger.debug('Package path to link globally:', packagePath);
			await pnpmLinkToGlobal(packagePath);
		} catch (err) {
			// continue and handle them later
			linkErrors.push(err);
		}

		if (linkErrors.length > 0) {
			spinner.warn('Cannot link some workspace packages globally');
			errors.push(...linkErrors);
			return false;
		}
	}

	if (missingPackages.length > 0) {
		spinner.warn(
			'Some workspace packages are missing. Please link them manually and try again'
		);
		errors.push(
			new Error(
				`Missing workspace dependencies: [${missingPackages.join(', ')}]`
			)
		);
		return false;
	}

	spinner.succeed('Workspace dependencies linked globally');
	return true;
}

export async function gitInitStage(
	options: InitOptions,
	infos: Information,
	errors: unknown[]
): Promise<boolean> {
	const spinner = ora('Create git repository');

	if (infos.isProject) {
		spinner.info('Skipped creating git repository (is Telestion Project)');
		return true;
	}

	if (!options.initGit) {
		spinner.info('Skipped creating git repository (explicitly turned off)');
		return false;
	}

	if (!(await isGitInstalled())) {
		spinner.warn('Skipped creating git repository (git not installed)');
		return false;
	}

	try {
		spinner.start();
		await lastAtLeast(1000, gitInit(infos.projectPath));
	} catch (err) {
		spinner.warn('Cannot create git repository (git init failed)');
		errors.push(err);
		return false;
	}

	try {
		spinner.text = 'Setup git repository';
		// stop spinner because it can interfere with inquirer prompt
		spinner.stop();
		await lastAtLeast(
			1000,
			gitSetup(infos.projectPath, options.gitUsername, options.gitEmail)
		);
		spinner.start();
	} catch (err) {
		spinner.warn('Cannot finish setup process (user provided invalid data)');
		errors.push(err);
		return false;
	}

	spinner.succeed('Git repository created');
	return true;
}

export async function depInstallStage(
	options: InitOptions,
	infos: Information,
	workspaceDependencies: string[],
	isPnpmInstalled: boolean,
	errors: unknown[]
): Promise<boolean> {
	const spinner = ora('Install dependencies');

	if (!options.install) {
		spinner.info('Skipped dependency installation (explicitly turned off)');
		return false;
	}

	if (!isPnpmInstalled) {
		spinner.warn('Skipped dependency installation (PNPM not installed)');
		return false;
	}

	try {
		spinner.start();
		await lastAtLeast(2000, pnpmInstall(infos.projectPath));
	} catch (err) {
		spinner.warn('Cannot install dependencies (PNPM install failed)');
		errors.push(err);
		return false;
	}

	if (workspaceDependencies.length > 0) {
		spinner.text = 'Link workspace dependencies';
		await wait(500);

		let failed = false;
		for (const dependency of workspaceDependencies) {
			try {
				await pnpmLinkFromGlobal(infos.projectPath, dependency);
			} catch (err) {
				failed = true;
				errors.push(err);
			}
		}

		if (failed) {
			spinner.warn(
				'Cannot link workspace dependencies (PNPM link global failed)'
			);
			return false;
		}
	}

	spinner.succeed('Dependencies installed');
	return true;
}

export async function gitCommitStage(
	options: InitOptions,
	infos: Information,
	isInitialized: boolean,
	errors: unknown[]
): Promise<boolean> {
	const spinner = ora('Add changes to staging list');

	if (!options.commit) {
		spinner.info('Skipped initial commit (explicitly turned off)');
		return false;
	}

	if (!isInitialized) {
		spinner.warn('Skipped initial commit (git repo not initialized)');
		return false;
	}

	try {
		spinner.start();
		await lastAtLeast(1000, gitAdd(infos.projectPath, ['.']));
	} catch (err) {
		spinner.warn('Cannot add changes to staging list (git add failed)');
		errors.push(err);
		return false;
	}

	try {
		spinner.text = 'Commit staged changes';
		await lastAtLeast(
			1000,
			gitCommit(infos.projectPath, [
				'feat: Initialized Telestion Frontend Project'
			])
		);
	} catch (err) {
		spinner.warn('Cannot commit staged changes (git commit failed)');
		errors.push(err);
		return false;
	}

	spinner.succeed('Changes committed');
	return true;
}
