const path = require('path');
const logger = require('../logger')('Name Processor');
const normalize = require('./normalize-module-name');

/**
 * Normalizes, wherever necessary, names and builds paths from these names
 *
 * @param projectName
 * @param templateModuleName
 * @returns {{templateModulePath: string, projectPath: string, moduleName: (string|*), templatePath: string}}
 * map of names and paths, based on `projectName` and `templateModuleName`
 */
module.exports = function getNamesAndPaths(projectName, templateModuleName) {
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
};
