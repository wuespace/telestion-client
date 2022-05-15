import { promisify } from 'util';
import {
	ChildProcess,
	execFile as nodeExecFileCallback,
	spawn as nodeSpawn,
	fork as nodeFork,
	ExecOptions,
	ForkOptions,
	SpawnOptions
} from 'child_process';

import { getLogger } from '../logger/index.mjs';
import { addChildProcess } from './process-management.mjs';

const nodeExecFile = promisify(nodeExecFileCallback);
const logger = getLogger('Child Process');

/**
 * Execute an executable from the parent process.
 * @param executablePath - path to the executable (can also be a filename that is available in the path)
 * @param args - arguments that the executable receives on execution
 * @param options - additional exec options
 */
export async function exec(
	executablePath: string,
	args?: string[],
	options?: ExecOptions
): Promise<{ stdout: string | Buffer; stderr: string | Buffer }> {
	logger.debug('Executable path:', executablePath);
	logger.debug('Arguments:', args);
	logger.debug('Exec options:', options);

	logger.debug('Execute executable');

	const result = await nodeExecFile(executablePath, args, options);
	logger.debug(`Exec Result for ${executablePath}:`, result);
	return result;
}

/**
 * Spawns an executable from the parent process.
 * @param executablePath - path to the executable (can also be a filename that is available in the path)
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

	logger.debug('Spawn process now');
	const childProcess = nodeSpawn(executablePath, args, options);
	logger.debug('Spawn process instance:', childProcess);
	addChildProcess(childProcess);
	return childProcess;
}

/**
 * Forks a JS module from the parent process and opens an IPC channel between both processes.
 * @param modulePath - path to the JS module to execute (can also be a filename that is available in the path)
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
	addChildProcess(childProcess);
	return childProcess;
}
