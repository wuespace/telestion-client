const exec = require('../async-exec');
const logger = require('../logger')('npm-install');

const installCommand = 'npm install --legacy-peer-deps';

module.exports = async function npmInstall(projectPath) {
	logger.debug('Install command:', installCommand);
	try {
		await exec(installCommand, { cwd: projectPath });
	} catch (e) {
		throw new Error(`Dependency installation failed. Details: ${e.message}`);
	}
};
