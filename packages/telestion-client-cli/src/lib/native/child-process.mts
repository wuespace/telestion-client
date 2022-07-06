import os from 'node:os';
import { promisify } from 'node:util';
import {
	ChildProcess as NodeChildProcess,
	exec as nodeExecCallback,
	execFile as nodeExecFileCallback,
	spawn as nodeSpawn,
	spawnSync as nodeSpawnSync,
	fork as nodeFork,
	ExecOptions,
	ForkOptions,
	SpawnOptions
} from 'node:child_process';

import { getLogger } from '../logger/index.mjs';
import { getCmdShellString, sanitizeArgument } from './cmd-sanitizer.mjs';

const nodeExec = promisify(nodeExecCallback);
const nodeExecFile = promisify(nodeExecFileCallback);
const logger = getLogger('Child Process');

export interface ChildProcess extends NodeChildProcess {
	/**
	 * Stops the child process platform independently.
	 */
	stop(signal?: NodeJS.Signals): void;
}

/**
 * Adds missing functionality to the child process instance.
 * @param childProcess the node child process
 */
function extend(childProcess: NodeChildProcess): ChildProcess {
	const extended = childProcess as ChildProcess;
	extended.stop = function (signal) {
		logger.debug('Stop child process', this.spawnargs.join(' '));
		if (this.exitCode !== null) {
			logger.debug('Child process already dead');
			return;
		}

		if (os.type() === 'Windows_NT') {
			logger.debug(
				'Detected Windows_NT operating system. Using taskkill to kill child process'
			);
			nodeSpawnSync('taskkill', ['/pid', `${this.pid}`, '/f', '/t']);
		} else {
			logger.debug('Using standard signal method');
			this.kill(signal);
		}
	};

	return extended;
}

/**
 * Execute an executable from the parent process.
 * @param executablePath - path to the executable
 * (can also be a filename that is available in the path)
 * @param args - arguments that the executable receives on execution
 * @param options - additional exec options
 */
export async function exec(
	executablePath: string,
	args: string[] = [],
	options: ExecOptions & { disableSanitizer?: boolean } = {}
): Promise<{ stdout: string | Buffer; stderr: string | Buffer }> {
	logger.debug('Executable path:', executablePath);
	logger.debug('Arguments:', args);
	logger.debug('Exec options:', options);

	let result: { stdout: string | Buffer; stderr: string | Buffer };
	logger.debug(`Execute ${executablePath} (${os.type()})`);
	if (os.type() === 'Windows_NT') {
		const disableSanitizer = options['disableSanitizer'] ?? false;
		const cmdShellString = getCmdShellString(
			executablePath,
			args,
			disableSanitizer
		);
		logger.debug('CMD shell string:', cmdShellString);
		logger.debug('Disable sanitizer?', disableSanitizer);

		result = await nodeExec(cmdShellString, options);
	} else {
		result = await nodeExecFile(executablePath, args, options);
	}

	logger.debug(`Exec Result for ${executablePath}:`, result);
	return result;
}

/**
 * Spawns an executable from the parent process.
 * @param executablePath - path to the executable
 * (can also be a filename that is available in the path)
 * @param args - arguments that the executable receives on spawning
 * @param options - additional spawn options
 */
export function spawn(
	executablePath: string,
	args: readonly string[] = [],
	options: SpawnOptions = {}
): ChildProcess {
	logger.debug('Executable path:', executablePath);
	logger.debug('Arguments:', args);
	logger.debug('Spawn options:', options);

	let childProcess: NodeChildProcess;
	logger.debug(`Spawn ${executablePath} (${os.type()})`);
	if (os.type() === 'Windows_NT') {
		const sanitizedArgs = args.map(sanitizeArgument);
		const disableSanitizer = options['shell'] ?? false;
		logger.debug('CMD sanitized args:', sanitizedArgs);
		logger.debug('Disable sanitizer?', disableSanitizer);

		childProcess = nodeSpawn(
			executablePath,
			// user explicitly enabled shell mode -> don't sanitize anything
			disableSanitizer ? args : sanitizedArgs,
			{
				shell: true,
				...options
			}
		);
	} else {
		childProcess = nodeSpawn(executablePath, args, options);
	}

	logger.debug('Spawn process instance:', childProcess);
	return extend(childProcess);
}

/**
 * Forks a JS module from the parent process and opens an IPC channel
 * between both processes.
 *
 * @param modulePath - path to the JS module to execute
 * (can also be a filename that is available in the path)
 * @param args - arguments that the JS module receives on forking
 * @param options - additional fork options
 */
export function fork(
	modulePath: string,
	args?: string[],
	options?: ForkOptions
): ChildProcess {
	logger.debug('Module path:', modulePath);
	logger.debug('Arguments:', args);
	logger.debug('Fork options:', options);

	logger.debug(`Fork process now`);
	const childProcess = nodeFork(modulePath, args, options);

	logger.debug('Fork process instance:', childProcess);
	return extend(childProcess);
}
