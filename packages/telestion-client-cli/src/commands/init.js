const path = require('path');
const fs = require('fs');
const { Spinner } = require('clui');
const logger = require('../lib/logger')('init');

const normalize = require('../lib/init/normalize-module-name');
const processTemplateTree = require('../lib/init/process-template-tree');
const npmInstall = require('../lib/init/npm-install');
const initializeGitRepository = require('../lib/init/git-init');
const initEpilogue = require('../lib/init/init-epilogue');
const getPackageJSONReplacers = require('../lib/init/package-json-replacers');
const askProjectName = require('../lib/init/ask-project-name');
const getTemplateDirTree = require('../lib/init/template-parser');
const findTemplateBasedRoot = require('../lib/find-template-based-project-root');
const exec = require('../lib/async-exec');

const spinner = new Spinner('', ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);

// yargs defs
const command = ['init [name]', 'i'];
const desc = 'Initializes a new Telestion Frontend Project';

function builder(yargs) {
	return yargs
		.positional('name', {
			describe: 'Name of the Telestion Frontend Project',
			type: 'string'
		})
		.option('commit', {
			alias: 'c',
			describe: 'Commits project initialization on finish',
			type: 'boolean',
			default: true
		})
		.option('skipGit', {
			alias: 's',
			describe: 'Skips project initialization as git repository',
			type: 'boolean',
			default: false
		})
		.option('skipInstall', {
			alias: 'i',
			describe: 'Skips installation of dependencies',
			type: 'boolean',
			default: false
		})
		.option('template', {
			alias: 't',
			describe: 'Specify a template module',
			type: 'string',
			default: '@wuespace/telestion-client-template'
		});
}

async function handler(argv) {
	logger.debug('Arguments:', argv);
	try {
		if (!argv['name']) {
			try {
				argv['name'] = await askProjectName();
			} catch (error) {
				if (error['isTtyError']) {
					logger.error(
						'Prompt could not be rendered in the current environment'
					);
					process.exit(1);
				}
			}
		}

		const projectName = argv['name'];
		const templateModuleName = argv['template'];

		const templateRoot = findTemplateBasedRoot();

		logger.info('Template Project Root', templateRoot);

		let {
			moduleName,
			projectPath,
			templatePath,
			templateModulePath
		} = templateRoot
			? normalizeAndExtractNames(projectName, templateModuleName)
			: await preprocessArgv(projectName, templateModuleName);

		let { skipInstall, skipGit, commit } = argv;

		if (templateRoot) {
			logger.success(
				`Detected telestion-project-template based project in ${templateRoot}.`
			);
			logger.info(
				`Generating client boilerplate into project's ./client folder.`
			);

			skipGit = true;
			projectPath = path.resolve(templateRoot, 'client');
			moduleName = 'client';
		}

		spinner.message('Parse template project ...');
		spinner.start();
		let tree = await getTemplateDirTree(templatePath);
		spinner.stop();
		logger.success('Parsed template project');

		spinner.message('Initialize new project with the template ...');
		spinner.start();
		await new Promise(resolve => setTimeout(resolve, 2000));
		spinner.stop();
		const replacers = getPackageJSONReplacers({
			templateModulePath,
			moduleName,
			projectName
		});

		// Process the root node of the template into the target dir
		logger.debug('Process and copy template directory to new project');
		await processTemplateTree(tree, projectPath, replacers);
		await installDependencies(skipInstall, projectPath);
		await initializeGitRepo(skipGit, projectPath, commit);

		if (templatePath) {
			logger.info('Committing changes');
			await exec(`git add client`, {
				cwd: templatePath
			});

			await exec(
				`git commit -m "feat(client): Initialize client using tc-cli"`,
				{ cwd: templatePath }
			);
		}

		logger.success('Project initialized');
		console.log(initEpilogue(projectPath));
	} catch (err) {
		spinner.stop();
		logger.error(err);
		process.exit(1);
	}
}

function normalizeAndExtractNames(projectName, templateModuleName) {
	let moduleName;
	moduleName = normalize(projectName);
	logger.debug('Project Name:', projectName);
	logger.debug('Module Name:', moduleName);

	const projectPath = path.join(process.cwd(), moduleName);

	try {
		const { templateDir } = require(`${templateModuleName}/package.json`);

		if (typeof templateDir !== 'string') {
			logger.error("Template module package.json missing key 'templateDir'");
			process.exit(1);
		}

		const templateModulePath = path.dirname(
			require.resolve(`${templateModuleName}/package.json`)
		);
		const templatePath = path.join(templateModulePath, templateDir);

		return { moduleName, projectPath, templateModulePath, templatePath };
	} catch (err) {
		logger.error(`Template module '${templateModuleName}' was not found`);
		logger.info(
			`Please check the module name or install with npm install -g ${templateModuleName}`
		);
		process.exit(404);
	}
}

async function preprocessArgv(projectName, templateModuleName) {
	let {
		moduleName,
		projectPath,
		templatePath,
		templateModulePath
	} = normalizeAndExtractNames(projectName, templateModuleName);

	logger.debug('Template path:', templatePath);
	logger.debug('Project path:', projectPath);

	logger.info('Your project will be installed to:', projectPath);
	if (fs.existsSync(projectPath)) {
		logger.error('The project installation path already exists.');
		logger.info(
			'Please remove any files from the installation path before continue.'
		);
		process.exit(1);
	}
	return {
		projectName,
		moduleName,
		projectPath,
		templatePath,
		templateModulePath
	};
}

async function installDependencies(skipInstall, projectPath) {
	if (!skipInstall) {
		spinner.message('Installing dependencies ...');
		spinner.start();
		await npmInstall(projectPath);
		spinner.stop();
		logger.success('Successfully installed dependencies');
	}
}

async function initializeGitRepo(skipGit, projectPath, commit) {
	if (!skipGit) {
		spinner.message('Initializing git repository ...');
		spinner.start();
		await initializeGitRepository(projectPath, commit);
		spinner.stop();
		logger.success('Successfully initialized git repository');
	}
}

module.exports = {
	command,
	desc,
	builder,
	handler
};
