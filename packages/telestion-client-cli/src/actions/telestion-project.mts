import { resolve, join } from 'path';

import { exists, getLogger, readFile } from '../lib/index.mjs';

const logger = getLogger('Project Action');

export const projectIdentifierFileName = `telestion-project`;
export const projectIdentifierFileContent = `This file is used to detect the folder structure within our automation tools.

DO NOT EDIT, MOVE, RENAME, OR REMOVE this file, or our development automation tools might not work as expected
`;
export const projectFrontendFolderName = 'client';

/**
 * Checks for the Telestion Project identifier file in the current working directory.
 * @param projectDir - the directory that can contain the project identifier
 */
export async function isTelestionProjectRoot(
	projectDir: string
): Promise<boolean> {
	const filePath = resolve(projectDir, projectIdentifierFileName);
	logger.debug('Check for project identifier at:', filePath);

	if (!(await exists(filePath))) return false;

	const content = await readFile(filePath);
	return content.trim() === projectIdentifierFileContent.trim();
}

/**
 * Searches the Telestion Project root up from the working directory.
 * If no Project is found, it returns `null`.
 * @param workingDir - the current working directory to check
 */
export async function getTelestionProjectRoot(
	workingDir: string
): Promise<string | null> {
	// remove dangling relative paths
	const searchDir = resolve(workingDir);
	// return if this is a project root
	if (await isTelestionProjectRoot(searchDir)) return searchDir;

	// search higher up in the tree
	const nextSearchDir = resolve(searchDir, '..');
	// we've reached the top
	if (searchDir === nextSearchDir) return null;

	// recursively search next
	return getTelestionProjectRoot(nextSearchDir);
}

/**
 * Returns the absolute Frontend Project path based on the working directory and the project name.
 * If a Telestion Project is found up higher in the tree, this is used instead.
 * @param workingDir - the current working directory
 * @param projectName - the project name to use as folder
 */
export async function getProjectPath(
	workingDir: string,
	projectName: string
): Promise<{ projectPath: string; isProject: boolean }> {
	const telestionProjectRoot = await getTelestionProjectRoot(workingDir);
	if (telestionProjectRoot) {
		const projectPath = resolve(
			telestionProjectRoot,
			projectFrontendFolderName
		);

		// special handling
		// 'client' may exist but not a 'package.json' inside
		if (await exists(join(projectPath, 'package.json'))) {
			throw new Error(
				`Your Frontend Project is already initialized at ${projectPath}`
			);
		}

		return { projectPath, isProject: true };
	}

	const projectPath = resolve(workingDir, projectName);

	if (await exists(projectPath)) {
		throw new Error(
			'The new Project directory already exists. Please remove it and try again'
		);
	}

	return { projectPath, isProject: false };
}
