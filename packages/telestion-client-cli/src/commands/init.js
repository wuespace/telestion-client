const path = require('path');
const fs = require('fs');
const sh = require('shelljs');
const inquirer = require('inquirer');
const dirTree = require('directory-tree');
const { Spinner } = require('clui');

const debug = require('debug')('init');
const logger = require('../lib/logger')('init');
const makePromiseLastAtLeast = require('../lib/promiseMinimumTime');

const normalize = require('../lib/normalizeModuleName');
const processTemplateTree = require('../lib/processTemplateTree');
const initEpilogue = require('../lib/initEpilogue');

const spinner = new Spinner('', ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);

const installCommand = 'npm install';
const gitInit = 'git init';
const gitCommit = 'git -am "Initial commit"';

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
		});
}

async function handler(argv) {
	// gathering information
	debug('Arguments:', argv);

	if (!argv['name']) {
		try {
			const answers = await inquirer.prompt({
				type: 'input',
				name: 'name',
				message: "What's the name of your new project?",
				validate: input => {
					if (!input) return 'Please provide a name for your project';
					if (input !== path.basename(input))
						return 'Please provide a valid name for your project';
					return true;
				}
			});
			debug('Inquirer name answers:', answers);
			argv['name'] = answers['name'];
		} catch (error) {
			if (error.isTtyError) {
				logger.error('Prompt could not be rendered in the current environment');
			}
			throw error;
		}
	}

	const projectName = argv['name'];
	let moduleName;
	try {
		moduleName = normalize(projectName);
	} catch (err) {
		logger.error(...err);
		process.exit(1);
	}
	debug('Project Name:', projectName);
	debug('Module Name:', moduleName);

	const projectPath = path.join(process.cwd(), moduleName);
	const templatePath = path.dirname(
		require.resolve('@wuespace/telestion-client-template/package.json')
	);
	debug('Template path:', templatePath);
	debug('Project path:', projectPath);

	logger.info('Your project will be installed to:', projectPath);
	if (fs.existsSync(projectPath)) {
		logger.error('The project installation path already exists.');
		logger.info(
			'Please remove any files from the installation path before continue.'
		);
		process.exit(1);
	}

	try {
		spinner.message('Parse template project ...');
		spinner.start();

		// Create template tree, all files have their file name + an .ejs extension
		debug('Build template directory tree');
		let tree;
		await makePromiseLastAtLeast(
			(async () => {
				tree = dirTree(templatePath, {
					exclude: [
						/\.git$/,
						/bootstremplatr\.json$/,
						/package\.json$/,
						/node_modules$/
					]
				});
				debug('Parsed template directory tree:', tree);
			})(),
			5000
		);
		spinner.stop();
		logger.success('Parsed template project');

		spinner.message('Initialize new project with template ...');
		spinner.start();
		await new Promise(resolve => setTimeout(resolve, 2000));
		spinner.stop();

		debug('Read template package.json');
		const templatePackageJson = require(path.join(
			templatePath,
			'package.json'
		));
		debug('Template package.json:', templatePackageJson);

		const replacers = {
			moduleName,
			projectName,
			dependencies: JSON.stringify(
				templatePackageJson.dependencies,
				null,
				'\t'
			),
			devDependencies: JSON.stringify(
				templatePackageJson.devDependencies,
				null,
				'\t'
			)
		};
		debug('Final replacers:', replacers);

		// Process the root node of the template into the target dir
		debug('Process and copy template directory to new project');
		await processTemplateTree(tree, projectPath, replacers);

		spinner.message('Installing dependencies ...');
		spinner.start();
		debug('Install command:', installCommand);
		sh.pushd(projectPath);
		const result = sh.exec(installCommand, { silent: !(process.env.DEBUG === 'init' || process.env.DEBUG !== '*') });
		sh.popd();
		spinner.stop();
		logger.success('Dependencies installed');

		logger.success('Initialized new project');
	} catch (err) {
		spinner.stop();
		logger.error(err);
		process.exit(1);
	}

	// print epilogue
	console.log(initEpilogue(projectPath));
}

module.exports = {
	command,
	desc,
	builder,
	handler
};
