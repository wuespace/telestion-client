///
/// process and child process management
///

export { sanitizeArgument, getCmdShellString } from './cmd-sanitizer.mjs';
export {
	addChildProcess,
	removeChildProcess,
	getChildProcesses,
	exit,
	registerEventHandlers
} from './process-management.mjs';
export { exec, spawn, fork } from './child-process.mjs';

///
/// filesystem management
///

export {
	// file reference management
	copyFile,
	rm,
	stat,
	exists,
	existsSync,
	move,
	rmIfExists,
	mkdir,
	symlink,
	realPath,
	chmod,
	// file content management
	readFile,
	readFileSync,
	writeFile,
	readDir
} from './filesystem.mjs';

///
/// utils
///

export { openUrl } from './util.mjs';
