import { join } from 'node:path';
import {
	copyFile,
	exists,
	getLogger,
	resourcesPath,
	rmIfExists
} from '../lib/index.mjs';

const logger = getLogger('Workspace Action');

const tagFileName = 'workspace.txt';
const tagFileSourcePath = join(resourcesPath, tagFileName);

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
	const tagFileDestPath = join(projectDir, tagFileName);
	logger.debug('Tag-file source path:', tagFileSourcePath);
	logger.debug('Tag-file destination path:', tagFileDestPath);
	logger.debug('Create workspace tag-file');
	await copyFile(tagFileSourcePath, tagFileDestPath);
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
