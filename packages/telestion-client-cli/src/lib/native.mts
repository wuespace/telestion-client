import os from 'os';
import { promisify } from 'util';
import { constants, Stats } from 'fs';
import {
	copyFile as nodeCopyFile,
	rm as nodeRm,
	stat as nodeStat,
	mkdir as nodeMkDir,
	readFile as nodeReadFile,
	writeFile as nodeWriteFile,
	readdir as nodeReadDir,
	symlink as nodeSymlink,
	rename as nodeRename,
	realpath as nodeRealPath,
	chmod as nodeChmod
} from 'fs/promises';
import {
	ChildProcess,
	execFile as nodeExecFile,
	spawn as nodeSpawn
} from 'child_process';
import { getLogger } from './logger/index.mjs';

const execFile = promisify(nodeExecFile);

const logger = getLogger('Native');

/**
 * Executes a command with an optional argument list.
 * No shell interpretation is happening, so it is safe to pass shell meta characters.
 *
 * @param command - the absolute path to the command you want to execute (e.g. /usr/bin/grep)
 * @param argumentList - the optional argument list that is directly passed to the command
 * @param workingDir - optional working directory
 */
export async function exec(
	command: string,
	argumentList: string[] = [],
	workingDir?: string
): Promise<{ stdout: string; stderr: string }> {
	logger.debug(`Execute '${command}' with:`, argumentList, 'in:', workingDir);
	const result = await execFile(command, argumentList, { cwd: workingDir });
	logger.debug('Result:', result);
	return result;
}

export async function spawn(
	command: string,
	argumentList: string[] = [],
	workingDir?: string,
	stdio: 'pipe' | 'ignore' | 'inherit' = 'ignore'
): Promise<ChildProcess> {
	logger.debug(
		`Spawn new process '${command}' with:`,
		argumentList,
		'in:',
		workingDir
	);
	const process = nodeSpawn(command, argumentList, { cwd: workingDir, stdio });
	logger.debug('Process instance:', process);
	return process;
}

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
 * Reads the contents of a file and returns them as a string.
 * @param filePath - the path to the file
 */
export async function readFile(filePath: string): Promise<string> {
	logger.debug(`Read from file '${filePath}'`);
	return nodeReadFile(filePath, { encoding: 'utf-8' });
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

/**
 * Opens the URL in the system's native browser.
 * @param url the URL to open
 */
export async function openUrl(url: URL): Promise<void> {
	let command: string;

	switch (os.type()) {
		case 'Darwin':
			command = 'open';
			break;
		case 'Windows_NT':
			command = 'explorer.exe';
			break;
		case 'Linux':
			command = 'xdg-open';
			break;
		default:
			throw new Error(
				`Cannot open url '${url.href}'. Unsupported platform: ${os.type()}`
			);
	}

	logger.debug(
		`Open URL '${
			url.href
		}' on platform '${os.type()}' with command '${command}'`
	);
	await spawn(command, [url.href]);
}
