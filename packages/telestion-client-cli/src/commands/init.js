const path = require('path');
const fs = require('fs');
const { Spinner } = require('clui');
const logger = require('../lib/logger')('init');

const processTemplateTree = require('../lib/init/process-template-tree');
const npmInstall = require('../lib/init/npm-install');
const initializeGitRepository = require('../lib/init/git-init');
const initEpilogue = require('../lib/init/init-epilogue');
const getPackageJSONReplacers = require('../lib/init/package-json-replacers');
const askProjectName = require('../lib/init/ask-project-name');
const getTemplateDirTree = require('../lib/init/template-parser');
const verifyTargetPathUninitialized = require('../lib/init/verify-target-path-uninitialized');
const getNamesAndPaths = require('../lib/init/get-names-and-paths');
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
	logger.debug('argv:', argv);

	try {
		await fillArgvBlanks(argv);
		const options = await getOptions(argv);
		logger.debug('options', options);
		verifyTargetPathUninitialized(
			options.telestionProjectTemplateProjectRoot,
			options.projectPath
		);

		spinner.message('Parse template project ...');
		spinner.start();
		let tree = await getTemplateDirTree(options.templatePath);
		spinner.stop();
		logger.success('Parsed template project');

		spinner.message('Initialize new project with the template ...');
		spinner.start();
		await new Promise(resolve => setTimeout(resolve, 2000));
		spinner.stop();
		const replacers = getPackageJSONReplacers(options);

		// Process the root node of the template into the target dir
		logger.debug('Process and copy template directory to new project');
		await processTemplateTree(tree, options.projectPath, replacers);

		if (!options.skipInstall) await installDependencies(options.projectPath);

		await processGitInteractions(options);

		logger.success('Project initialized');
		console.log(initEpilogue(options.projectPath));
	} catch (err) {
		spinner.stop();
		logger.error(err);
		process.exit(1);
	}
}

async function processGitInteractions(options) {
	let isTemplateProjectRootAGitRepository =
		options.telestionProjectTemplateProjectRoot &&
		fs.existsSync(
			path.join(options.telestionProjectTemplateProjectRoot, '.git')
		);

	if (!options.skipGit && !options.telestionProjectTemplateProjectRoot) {
		await initializeGitRepo(options.projectPath, options.commit);
	} else if (!options.skipGit && isTemplateProjectRootAGitRepository) {
		await commitClientInTemplateBasedProject(options);
	}
}

async function fillArgvBlanks(argv) {
	try {
		// Project Name
		if (!argv['name']) {
			argv['name'] = await askProjectName();
		}
	} catch (error) {
		if (error['isTtyError']) {
			logger.error('Prompt could not be rendered in the current environment');
			process.exit(1);
		}
	}
}

/**
 * Builds a set of unified options for various environments, based on the context of the current CWD and `argv`.
 *
 * For example, this mostly unifies the later process for both telestion-project-template based projects and others.
 *
 * @param argv - the argv passed by yargs
 * @returns {Promise<*&{telestionProjectTemplateProjectRoot: (string|boolean|*)}>}
 * the final, unified set of options
 */
async function getOptions(argv) {
	const telestionProjectTemplateProjectRoot = findTemplateBasedRoot();
	let argvOptions = { ...argv };

	let namesAndPaths = getNamesAndPaths(argvOptions.name, argvOptions.template);

	if (telestionProjectTemplateProjectRoot) {
		logger.success(
			`Detected telestion-project-template based project in ${path.relative(
				process.cwd(),
				telestionProjectTemplateProjectRoot
			)}.`
		);
		logger.info(
			`Generating client boilerplate into project's ./client folder.`
		);

		namesAndPaths.projectPath = path.resolve(
			telestionProjectTemplateProjectRoot,
			'client'
		);
	}

	logger.debug('Template path:', namesAndPaths.templatePath);
	logger.debug('Project path:', namesAndPaths.projectPath);

	logger.info(
		'Your project will be installed to:',
		path.relative(process.cwd(), namesAndPaths.projectPath)
	);

	return {
		telestionProjectTemplateProjectRoot,
		...argvOptions,
		...namesAndPaths
	};
}

async function installDependencies(projectPath) {
	spinner.message('Installing dependencies ...');
	spinner.start();
	await npmInstall(projectPath);
	spinner.stop();
	logger.success('Successfully installed dependencies');
}

async function initializeGitRepo(projectPath, commit) {
	spinner.message('Initializing git repository ...');
	spinner.start();
	await initializeGitRepository(projectPath, commit);
	spinner.stop();
	logger.success('Successfully initialized git repository');
}

async function commitClientInTemplateBasedProject(options) {
	logger.info('Committing changes');

	await exec(`git add client`, {
		cwd: options.telestionProjectTemplateProjectRoot
	});

	await exec(`git commit -m "feat(client): Initialize client using tc-cli"`, {
		cwd: options.telestionProjectTemplateProjectRoot
	});

	logger.success('Changes committed successfully.');
}

module.exports = {
	command,
	desc,
	builder,
	handler
};
