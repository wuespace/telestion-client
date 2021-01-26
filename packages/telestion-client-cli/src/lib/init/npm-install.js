const exec = require('../async-exec');

const installCommand = 'npm install';

module.exports = async function npmInstall(
	projectPath,
	spinner,
	logger,
	debug
) {
	spinner.message('Installing dependencies ...');
	spinner.start();

	debug('Install command:', installCommand);
	try {
		await exec(installCommand, { cwd: projectPath });

		spinner.stop();
		logger.success('Dependencies installed');
	} catch (e) {
		logger.error('Dependency installation failed');
		debug(e);
		process.exit(1);
	}
};
