const logger = require('../logger')('package-json-replacers');

function getPackageJSONReplacers({
	templateModulePath,
	moduleName,
	projectName
}) {
	logger.debug('Read template package.json');
	const templatePackageJson = require(`${templateModulePath}/package.json`);
	logger.debug('Template package.json:', templatePackageJson);

	const replacers = {
		moduleName,
		projectName,
		dependencies: JSON.stringify(templatePackageJson.dependencies, null, '\t'),
		devDependencies: JSON.stringify(
			templatePackageJson.devDependencies,
			null,
			'\t'
		)
	};
	logger.debug('Final replacers:', replacers);
	return replacers;
}

module.exports = getPackageJSONReplacers;
