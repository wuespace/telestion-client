const dirTree = require('directory-tree');
const makePromiseLastAtLeast = require('../promise-minimum-time');
const logger = require('../logger')('template-parser');

async function getTemplateDirTree(templatePath) {
	// Create template tree, all files have their file name + an .ejs extension
	logger.debug('Build template directory tree');
	const tree = await makePromiseLastAtLeast(
		(async () => {
			return dirTree(templatePath);
		})(),
		5000
	);
	logger.debug('Parsed template directory tree:', tree);
	return tree;
}

module.exports = getTemplateDirTree;
