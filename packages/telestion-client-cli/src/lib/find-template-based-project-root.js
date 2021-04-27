const fs = require('fs');
const path = require('path');

const projectIdentifierFileName = `telestion-project`;
const projectIdentifierFileContent = `This file is used to detect the folder structure within our automation tools.

DO NOT EDIT, MOVE, RENAME, OR REMOVE this file, or our development automation tools might not work as expected
`;

/**
 * Searches (up from the cwd) for the root folder of a telestion-project-template based repository.
 *
 * @returns {string | boolean} the path to the project's root, if it's based on the template, false if not within
 * a telestion-project-template based repository
 */
function findTemplateBasedProjectRoot(startPath = process.cwd()) {
	if (path.resolve(startPath, '..') === path.resolve(startPath)) {
		return false; // reached root dir
	}

	const searchPath = path.resolve(startPath, projectIdentifierFileName);
	if (
		fs.existsSync(searchPath) &&
		fs.readFileSync(searchPath).toString().trim() ===
			projectIdentifierFileContent.trim()
	) {
		return path.dirname(searchPath);
	} else {
		return findTemplateBasedProjectRoot(path.resolve(startPath, '..'));
	}
}

module.exports = findTemplateBasedProjectRoot;
