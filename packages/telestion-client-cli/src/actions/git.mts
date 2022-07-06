import { resolve } from 'node:path';
import inquirer from 'inquirer';

import { CompositeError, exec, getLogger } from '../lib/index.mjs';

const logger = getLogger('Git Action');

/**
 * Returns `true` when git is installed and accessible on the current machine.
 */
export async function isGitInstalled(): Promise<boolean> {
	try {
		await exec('git', ['--version']);
		return true;
	} catch (err) {
		return false;
	}
}

/**
 * Extracts and returns a git configuration property from the git repository configuration store.
 *
 * For example:
 * ```
 * const username = await getConfigProp('/path/to/repo', 'user.name');
 * const userEmail = await getConfigProp('/path/to/repo', 'user.email');
 * ```
 *
 * @param workingDir - path inside a git repository
 * @param property - the property that contains the information
 */
export async function getConfigProp(
	workingDir: string,
	property: string
): Promise<string | undefined> {
	try {
		const result = await exec('git', ['config', property], { cwd: workingDir });
		return result.stdout.toString().trim();
	} catch (err) {
		logger.info(`Property ${property} is not set`);
		return undefined;
	}
}

/**
 * Sets a git configuration property in a git repository configuration store.
 *
 * For example:
 * ```
 * await setConfigProp('/path/to/repo', 'user.name', 'John Doe');
 * await setConfigProp('/path/to/repo', 'user.email', 'john.doe@example.com');
 * ```
 *
 * @param workingDir - path inside a git repository
 * @param property - the property that contains the new information
 * @param value - the new value for that property
 */
export async function setConfigProp(
	workingDir: string,
	property: string,
	value: string
): Promise<void> {
	try {
		await exec('git', ['config', property, value], { cwd: workingDir });
	} catch (err) {
		logger.error(
			`Cannot set '${value}' on '${property}' in git repository '${workingDir}'`
		);
		throw err;
	}
}

/**
 * Runs the minimal setup steps required to successfully use git.
 * @param workingDir - path inside a git repository
 * @param username - external username that should be used instead of asking the user interactively
 * @param email - external email address that should be used instead of asking the user interactively
 */
export async function gitSetup(
	workingDir: string,
	username?: string,
	email?: string
): Promise<void> {
	// user overrides win
	const initialValues = {
		username: username || (await getConfigProp(workingDir, 'user.name')),
		email: email || (await getConfigProp(workingDir, 'user.email')),
		signingKey: ''
	};
	const gpgSign =
		(await getConfigProp(workingDir, 'commit.gpgsign')) === 'true';

	let userValues: { username: string; email: string; signingKey: string };
	try {
		userValues = await inquirer.prompt<{
			username: string;
			email: string;
			signingKey: string;
		}>(
			[
				{
					type: 'input',
					name: 'username',
					message: 'Please enter your git username (used in commit messages):',
					default: 'John Doe',
					// non-empty string check
					validate: input => input.length > 0
				},
				{
					type: 'input',
					name: 'email',
					message:
						'Please enter your git email address (used in commit messages):',
					default: 'john.doe@example.com',
					// a very basic email address test
					// TODO: Provide better regex for matching an email address
					validate: input => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
				}
			],
			initialValues
		);

		if (gpgSign) {
			const { signingKey } = await inquirer.prompt<{
				signingKey: string;
			}>([
				{
					type: 'input',
					name: 'signingKey',
					message:
						"We have detected that you're require signed commits.\nPlease enter your GPG signing key (empty input disables signing for this repo):"
				}
			]);

			userValues.signingKey = signingKey;
		}
	} catch (err) {
		logger.error('Cannot gather required information to set up git');
		throw err;
	}

	// ok, we have the required information
	// let's set them in the working directory
	try {
		await setConfigProp(workingDir, 'user.name', userValues.username);
		await setConfigProp(workingDir, 'user.email', userValues.email);
		if (userValues.signingKey.length === 0) {
			await setConfigProp(workingDir, 'commit.gpgsign', 'false');
		} else {
			await setConfigProp(workingDir, 'user.signingkey', userValues.signingKey);
		}
	} catch (err) {
		throw new CompositeError(
			'Cannot set gathered information in git set up',
			err
		);
	}
}

/**
 * Returns the path to the git repository.
 * @param workingDir - the working directory to check for a git repository presence
 */
export async function getGitRoot(workingDir: string): Promise<string> {
	try {
		logger.debug('Search for git repository in:', workingDir);
		const result = await exec('git', ['rev-parse', '--git-dir'], {
			cwd: workingDir
		});
		return resolve(result.stdout.toString(), '..');
	} catch (err) {
		throw new Error(
			`Your working directory '${workingDir}' doesn't reside in a git repository.` +
				'Maybe initialize it first?'
		);
	}
}

/**
 * Returns `true` when in a git repository.
 * @param workingDir - the working directory to check for a git repository presence
 */
export async function isGitRepo(workingDir: string): Promise<boolean> {
	try {
		await getGitRoot(workingDir);
		return true;
	} catch (err) {
		return false;
	}
}

/**
 * Creates a new git repository at the specified git root.
 * @param gitRoot - the starting point of a new git repository
 */
export async function gitInit(gitRoot: string): Promise<void> {
	try {
		await exec('git', ['init'], { cwd: gitRoot });
	} catch (err) {
		throw new CompositeError(
			`Cannot create a new git repository in: ${gitRoot}`,
			err
		);
	}
}

/**
 * Adds files to the git staging list that should be committed later.
 * @param workingDir - the working directory
 * @param files - file paths relative to the specified working directory
 */
export async function gitAdd(
	workingDir: string,
	files: string[]
): Promise<void> {
	try {
		await exec('git', ['add', ...files], { cwd: workingDir });
	} catch (err) {
		throw new CompositeError(
			`Cannot add ${files
				.map(file => `'${file}'`)
				.join(', ')} to the staging list in: ${workingDir}`,
			err
		);
	}
}

/**
 * Commits the staged files.
 * @param workingDir - the working directory
 * @param messages - a list of commit messages (each entry represents a line in the commit message)
 */
export async function gitCommit(
	workingDir: string,
	messages: string[]
): Promise<void> {
	try {
		const messageArgs = messages.flatMap(message => ['-m', message]);
		logger.debug('Commit message arguments:', messageArgs);
		await exec('git', ['commit', ...messageArgs], { cwd: workingDir });
	} catch (err) {
		throw new CompositeError(
			`Cannot commit the staged files in: ${workingDir}`,
			err
		);
	}
}
