const validate = require('validate-npm-package-name');

/**
 * Replaces whitespaces with minus and lowercase every character.
 * Additionally it checks for a valid npm package name.
 * @param name string to normalize
 * @returns {string} normalized string
 */
function normalizeModuleName(name) {
	const normalized = name
		.split(' ')
		.map((part) => part.toLowerCase())
		.join('-');

	const results = validate(normalized);
	if (!results.validForNewPackages) {
		throw [].concat(results['errors'] || [], results['warnings'] || []);
	}

	return normalized;
}

module.exports = normalizeModuleName;
