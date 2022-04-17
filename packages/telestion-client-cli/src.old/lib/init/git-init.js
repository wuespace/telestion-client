const exec = require('../async-exec');
const logger = require('../logger')('git-init');

const gitInit = 'git init';
const gitAdd = 'git add .';
const gitCommit = 'git commit -m "Initial commit"';

async function runGitInit(projectPath) {
	let isGitRepo = false;
	logger.debug('Git init command:', gitInit);
	try {
		await exec(gitInit, { cwd: projectPath });

		isGitRepo = true;
	} catch (e) {
		throw new Error(`Git init failed. Details: ${e.message}`);
	}
	return isGitRepo;
}

/**
 * @param {string} projectPath
 */
async function makeInitialCommit(projectPath) {
	logger.debug('Git commit command:', gitCommit);
	try {
		await exec(gitAdd, { cwd: projectPath });
		await exec(gitCommit, { cwd: projectPath });
	} catch (e) {
		throw new Error('Initial commit failed. Details: ' + e.message);
	}
}

module.exports = { runGitInit, makeInitialCommit };
