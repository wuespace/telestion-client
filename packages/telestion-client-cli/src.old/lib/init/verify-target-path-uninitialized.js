const fs = require('fs');
const path = require('path');
const logger = require('../logger')('Init Dir Checker');

/**
 * Verifies that no PSC has been initialized in the `projectPath`.
 *
 * Exits the process with code `1` and an error message if a project already exists in the target path (`projectPath`).
 *
 * @param telestionProjectTemplateProjectRoot - truthy (e.g., the path to the root), if in a telestion-project-template
 * based project. Since then, the folder already exists (`./client`), the existence of a `package.json` gets checked.
 * @param projectPath - the path to the project
 */
module.exports = function verifyTargetPathUninitialized(
	telestionProjectTemplateProjectRoot,
	projectPath
) {
	if (
		fs.existsSync(
			telestionProjectTemplateProjectRoot
				? path.join(projectPath, 'package.json')
				: projectPath
		)
	) {
		logger.error('The project installation path already exists.');
		logger.info(
			'Please remove any files from the installation path before continue.'
		);
		process.exit(1);
	}
};
