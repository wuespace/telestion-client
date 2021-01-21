const path = require('path');
const fs = require('fs');
const sh = require('shelljs');
const ejs = require('ejs');

const debug = require('debug')('template-tree-processor');
const logger = require('../logger')('template-tree-processor');

async function processDirectory(node, targetPath, replacers) {
	debug('Processing dir', node.path, 'for target', targetPath);
	sh.mkdir(targetPath); // create the directory (pretty much self-explanatory)
	logger.success('Created directory:', targetPath);

	await Promise.all(
		node.children.map(
			async child =>
				await processTemplateTree(
					child,
					path.join(targetPath, child.name),
					replacers
				) // process the child node
		)
	);
}

async function processFile(node, targetPath, replacers) {
	debug('Processing file', node.path, 'for target', targetPath);
	if (node.extension === '.ejs') {
		let targetPathWithoutEJSExtension = targetPath.substr(
			0,
			targetPath.length - node.extension.length
		);
		fs.writeFileSync(
			targetPathWithoutEJSExtension,
			await ejs.renderFile(node.path, replacers)
		); // Render the template into the target path (without the .ejs extension)
		logger.success('Created file:', targetPathWithoutEJSExtension);
	} else {
		sh.cp(node.path, targetPath);
		logger.success('Created file:', targetPath);
	}
}

/**
 * Processes a node in the file tree
 * @param node A node in the file tree
 * @param targetPath the (raw) path (including the original extension) of the target. `.ejs` gets stripped internally
 * @param replacers
 * @return {Promise<void>}
 */
module.exports = async function processTemplateTree(
	node,
	targetPath,
	replacers
) {
	if (node.type === 'directory') {
		await processDirectory(node, targetPath, replacers);
	} else if (node.type === 'file') {
		await processFile(node, targetPath, replacers);
	}
};
