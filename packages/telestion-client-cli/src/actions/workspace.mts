import { join } from 'path';
import { exists, getLogger, rmIfExists, writeFile } from '../lib/index.mjs';

const logger = getLogger('Workspace Action');

const tagFileName = 'workspace.txt';

const tagFileContent =
	"!!! DON'T EDIT OR REMOVE !!!\n\n" +
	'This project contains workspace dependencies.\n' +
	"Some features like native dependencies aren't available.\n" +
	'If you want to use the full feature set, install @wuespace/telestion-client-cli ' +
	'from the NPM registry and initialize a new project.\n';

/**
 * Extracts dependencies specified with the 'workspace' protocol.
 * @param allDependencies - the dependency object that contains both real and workspace dependencies
 */
export function extractWorkspaceDependencies(
	allDependencies: Record<string, string>
): [
	realDependencies: Record<string, string>,
	workspaceDependencies: Array<string>
] {
	const workspaceDependencies: string[] = [];

	const realDependencies = Object.keys(allDependencies).reduce((obj, key) => {
		const value = allDependencies[key];
		if (value.toLowerCase().includes('workspace')) {
			// remove workspace dependency and put it in separate list
			workspaceDependencies.push(key);
		} else {
			// keep current semver spec
			obj[key] = value;
		}
		return obj;
	}, {} as Record<string, string>);

	return [realDependencies, workspaceDependencies];
}

/**
 * Creates the workspace tag in the specified project directory.
 * @param projectDir - path to the project directory
 */
export async function createWorkspaceTag(projectDir: string): Promise<void> {
	const tagFilePath = join(projectDir, tagFileName);
	logger.debug('Tag-file path:', tagFilePath);
	logger.debug('Create workspace tag-file');
	await writeFile(tagFilePath, tagFileContent);
}

/**
 * Removes the workspace tag in the specified project directory.
 * @param projectDir - path to the project directory
 */
export async function removeWorkspaceTag(projectDir: string): Promise<void> {
	const tagFilePath = join(projectDir, tagFileName);
	logger.debug('Tag-file path:', tagFilePath);
	logger.debug('Remove workspace tag-file');
	await rmIfExists(tagFilePath);
}

/**
 * Returns `true`, when the specified project directory contains
 * a workspace tag.
 * @param projectDir - path to the project directory
 */
export async function hasWorkspaceTag(projectDir: string): Promise<boolean> {
	const tagFilePath = join(projectDir, tagFileName);
	logger.debug('Tag-file path:', tagFilePath);
	logger.debug('Probe for workspace tag-file');
	return exists(tagFilePath);
}
