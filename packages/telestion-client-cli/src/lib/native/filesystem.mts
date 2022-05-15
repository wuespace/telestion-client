import {
	chmod as nodeChmod,
	copyFile as nodeCopyFile,
	mkdir as nodeMkDir,
	readdir as nodeReadDir,
	readFile as nodeReadFile,
	realpath as nodeRealPath,
	rename as nodeRename,
	rm as nodeRm,
	stat as nodeStat,
	symlink as nodeSymlink,
	writeFile as nodeWriteFile
} from 'fs/promises';
import {
	constants,
	existsSync as nodeExistsSync,
	readFileSync as nodeReadFileSync,
	Stats
} from 'fs';
import { getLogger } from '../logger/index.mjs';

const logger = getLogger('Native');

///
/// File reference manipulation
///

/**
 * Copies a file from the source path to the destination path.
 * @param sourcePath - the path to original file you want to copy
 * @param destPath - the path to the copy
 * @param overwrite - when the destination path is already "occupied" by a file, then replace it
 */
export async function copyFile(
	sourcePath: string,
	destPath: string,
	overwrite = false
): Promise<void> {
	logger.debug(
		`Copy '${sourcePath}' to '${destPath}'${overwrite ? ' (force)' : ''}`
	);
	if (overwrite) {
		return nodeCopyFile(sourcePath, destPath, constants.COPYFILE_FICLONE);
	} else {
		return nodeCopyFile(
			sourcePath,
			destPath,
			constants.COPYFILE_FICLONE | constants.COPYFILE_EXCL
		);
	}
}

/**
 * Removes a file or directory at the specified path.
 * @param path - the path to the file or directory you want to delete
 * @param recursive - if it is a directory you want to delete,
 * recurse into it and delete its children too
 */
export async function rm(path: string, recursive = false): Promise<void> {
	logger.debug(`Delete '${path}'`);
	return nodeRm(path, { recursive });
}

/**
 * Scrapes information about a file.
 * @param path - the path to the file to check
 */
export async function stat(path: string): Promise<Stats> {
	logger.debug(`Get stats of '${path}'`);
	return nodeStat(path);
}

/**
 * Returns `true` if the path exists.
 * @param path - the path to check for existence
 */
export async function exists(path: string): Promise<boolean> {
	logger.debug(`Check '${path}' for existence`);
	try {
		await stat(path);
		return true;
	} catch (err) {
		return false;
	}
}

/**
 * Returns `true` if the path exists. (synchronous version)
 * @param path - the path to check for existence
 */
export function existsSync(path: string): boolean {
	logger.debug(`Check '${path}' for existence (synchronously)`);
	return nodeExistsSync(path);
}

/**
 * Moves a file from the old path to the new path.
 * @param oldPath - the path to the file you want to move
 * @param newPath - the destination path the file should have once the function returns
 */
export async function move(oldPath: string, newPath: string): Promise<void> {
	logger.debug(`Move file from ${oldPath} to ${newPath}`);
	return nodeRename(oldPath, newPath);
}

/**
 * Removes a file or directory if it exists.
 * @param path - the path to the file or directory you want to delete
 * @param recursive - if it is a directory you want to delete,
 * recurse into it and delete its children too
 */
export async function rmIfExists(
	path: string,
	recursive = false
): Promise<boolean> {
	if (!(await exists(path))) {
		return false;
	}

	await rm(path, recursive);
	return true;
}

/**
 * Creates a directory.
 * If the given path already exists and recursive is {@code false}, the function rejects.
 *
 * @param dirPath - the path to new directory
 * @param recursive - when {@code true} parent directory are created if they aren't exist yet
 */
export async function mkdir(
	dirPath: string,
	recursive = false
): Promise<string | void> {
	logger.debug(
		`Create a directory at '${dirPath}'${recursive ? ' (recursively)' : ''}`
	);
	return nodeMkDir(dirPath, { recursive });
}

/**
 * Creates a symlink at the specified path that points to another path.
 * @param pointsTo - the path to which the link should point
 * @param symlinkPath - the path on which the link should be generated
 * @param type - the type of soft link to use (only support in Windows)
 */
export async function symlink(
	pointsTo: string,
	symlinkPath: string,
	type: 'dir' | 'file' | 'junction' = 'file'
): Promise<void> {
	logger.debug(
		`Create symbolic link at '${symlinkPath}' which points to '${pointsTo}' (type: ${type})`
	);
	return nodeSymlink(pointsTo, symlinkPath, type);
}

/**
 * Determines the actual location of the symlink path.
 * @param symlinkPath - the path to the symbolic link that should be resolved
 */
export async function realPath(symlinkPath: string): Promise<string> {
	logger.debug(`Resolve real path of symlink '${symlinkPath}'`);
	return nodeRealPath(symlinkPath);
}

/**
 * Changes the access bits of a file.
 * @param filePath - the file that receives the new access bits
 * @param mode - the access bits in an octal format (`1336`) or in a human-readable format (`"755"`)
 */
export async function chmod(
	filePath: string,
	mode: number | string
): Promise<void> {
	logger.debug(`Set access bits on file '${filePath}':`, mode);
	await nodeChmod(filePath, mode);
}

///
/// File content manipulation
///

/**
 * Reads the contents of a file and returns them as a string.
 * @param filePath - the path to the file
 */
export async function readFile(filePath: string): Promise<string> {
	logger.debug(`Read from file '${filePath}'`);
	return nodeReadFile(filePath, { encoding: 'utf-8' });
}

/**
 * Reads the contents of a file and returns them as a string.
 * (synchronous version)
 *
 * @param filePath - the path to the file
 */
export function readFileSync(filePath: string): string {
	logger.debug(`Read from file '${filePath}' (synchronously)`);
	return nodeReadFileSync(filePath, { encoding: 'utf-8' });
}

/**
 * Writes the given contents to a file.
 * @param filePath - the path to the file
 * @param content - the new content
 * @param append - when {@code true} the new content is appended to the existing one
 */
export async function writeFile(
	filePath: string,
	content: string,
	append = false
): Promise<void> {
	logger.debug(`Write to file '${filePath}'${append ? ' (append)' : ''}`);
	return nodeWriteFile(filePath, content, { flag: append ? 'a' : 'w' });
}

/**
 * Reads the contents of a directory and returns the names of all elements.
 * @param dirPath - the path to the directory
 */
export async function readDir(dirPath: string): Promise<string[]> {
	logger.debug(`Read element names from directory '${dirPath}'`);
	return nodeReadDir(dirPath);
}
