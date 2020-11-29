const sh = require('shelljs');
const logger = require('./logger')('external-dependencies');

module.exports = function checkExternalDependencies(deps) {
	const missingDeps = deps.filter(dep => !sh.which(dep));
	if (missingDeps.length > 0) {
		logger.error('Missing dependencies:', missingDeps.join(', '));
		logger.info('Please install them and run the command again to continue.');
		process.exit(1);
	}
}
