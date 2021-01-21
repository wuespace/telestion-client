const exec = require('../async-exec');

const gitInit = 'git init';
const gitCommit = 'git -am "Initial commit"';

async function runGitInit(debug, projectPath, spinner, logger) {
	let isGitRepo = false;
	debug('Git init command:', gitInit);
	try {
		await exec(gitInit, { cwd: projectPath });

		spinner.stop();
		isGitRepo = true;
		logger.success('Git repository initialized');
	} catch (e) {
		logger.error('Git repository initialization failed');
		debug(e);
	}
	return isGitRepo;
}

async function makeInitialCommit(projectPath, spinner, logger, debug) {
	spinner.message('Add initial commit');
	spinner.start();

	debug('Git commit command:', gitCommit);
	try {
		await exec(gitCommit, { cwd: projectPath });

		spinner.stop();
		logger.success('Added initial commit');
	} catch (e) {
		logger.error('Initial commit creation failed');
		debug(e);
	}
}

module.exports = async function initializeGitRepsitory(
	projectPath,
	argv,
	spinner,
	logger,
	debug
) {
	spinner.message('Initialize project as git repository');
	spinner.start();
	const isGitRepo = await runGitInit(debug, projectPath, spinner, logger);

	if (isGitRepo && argv['commit']) {
		await makeInitialCommit(projectPath);
	}
};
