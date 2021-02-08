const { cosmiconfig } = require('cosmiconfig');

const moduleName = 'telestion';
const explorer = cosmiconfig(moduleName, {
	ignoreEmptySearchPlaces: false
});

/**
 * @returns {Promise<import('cosmiconfig').CosmiconfigResult>}
 */
async function getConfig() {
	const config = await explorer.search();

	if (config === null) {
		throw new Error(
			'No config file found. Expected to find .telestionrc, telestion.get-config.js, or something similar. ' +
				'Please create a config file and try again.'
		);
	}

	return config;
}

module.exports = getConfig;
