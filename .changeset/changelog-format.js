/// Custom changeset format for the `telestion-client` project

/**
 * @param {import('@changesets/types').NewChangesetWithCommit} changeset
 * @param {import('@changesets/types').VersionType} _type
 * @returns {Promise<string>}
 */
const getReleaseLine = async (changeset, _type) => {
	const [firstLine, ...futureLines] = changeset.summary
		.split('\n')
		.map(l => l.trimEnd());

	let returnVal = `- ${firstLine}`;

	if (futureLines.length > 0) {
		returnVal += `\n${futureLines.map(l => `  ${l}`).join('\n')}`;
	}

	return returnVal;
};

/**
 * @param {import('@changesets/types').NewChangesetWithCommit[]} changesets
 * @param {import('@changesets/types').ModCompWithPackage[]} dependenciesUpdated
 * @returns {Promise<string>}
 */
const getDependencyReleaseLine = async (changesets, dependenciesUpdated) => {
	if (dependenciesUpdated.length === 0) return '';

	return '- Update ecosystem dependencies';
};

/**
 * @type {import('@changesets/types').ChangelogFunctions}
 */
const defaultChangelogFunctions = {
	getReleaseLine,
	getDependencyReleaseLine
};

module.exports = defaultChangelogFunctions;
