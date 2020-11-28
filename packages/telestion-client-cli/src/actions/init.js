const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const sh = require('shelljs');
const dirTree = require('directory-tree');
const ejs = require('ejs');

const debug = require('debug')('init');
const logger = require('../lib/logger')('init');
const normalize = require('../lib/normalizeModuleName');

const templatePath = path.join(__dirname, '..', '..', 'template');

// yargs defs
const command = ['init [name]', 'i'];
const desc = 'Initializes a new Telestion Frontend Project';

function builder(yargs) {
	return yargs
		.option('name', {
			alias: 'n',
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

/**
 * Processes a node in the file tree
 * @param node A node in the file tree
 * @param targetPath the (raw) path (including the original extension) of the target. `.ejs` gets stripped internally
 * @return {Promise<void>}
 */
async function processTemplateTree(node, targetPath) {
	if (node.type === 'directory') {
		debug('Processing dir', node.path, 'for target', targetPath);
		sh.mkdir(targetPath); // create the directory (pretty much self-explanatory)

		for (let child of node.children) {
			// recursively process children of the directory
			await processTemplateTree(child, path.join(targetPath, child.name)); // process the child node
		}
	} else if (node.type === 'file') {
		debug('Processing file', node.path, 'for target', targetPath);
		fs.writeFileSync(targetPath.substr(0, targetPath.length - node.extension.length),
			await ejs.renderFile(node.path, /* Pass in potential variables */ {test: 'abc'})
		) // Render the template into the target path (without the .ejs extension)
	}
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
				validate: (input) => {
					if (!input) return 'Please provide a name for your module';
					if (input !== path.basename(input))
						return 'Please provide a valid name for your module';
					return true;
				},
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

	let projectName = argv['name'];
	try {
		projectName = normalize(projectName);
	} catch (err) {
		logger.error(...err);
		process.exit(1);
	}
	debug('Normalized project name:', projectName);
	const projectPath = path.join(process.cwd(), projectName);
	debug('Template path:', templatePath);
	debug('Project path:', projectPath);

	// Create tree, all files have their file name + an .ejs extension
	const tree = dirTree(templatePath, {
		extensions: /\.ejs/, // filter for .ejs files only. This ensures consistency in templates
	});
	debug('Parsed template directory tree:', tree);

	// Ensure the target dir exists, TODO: Better checks here :P
	debug('Delete project directory');
	sh.rm('-r', projectPath);

	// Process the root node of the template into the target dir
	debug('Process and copy template directory to new project');
	await processTemplateTree(tree, projectPath);

	// Announce success
	logger.success('Finished');
}

module.exports = {
	command,
	desc,
	builder,
	handler
};
