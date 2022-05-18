import { createInterface } from 'node:readline';
import { ChildProcess } from 'node:child_process';
import { getLogger } from '../logger/index.mjs';

const logger = getLogger('Process Management');

export type Signal = 'SIGHUP' | 'SIGINT' | 'SIGTERM' | 'SIGKILL';

export const signalCodes: Record<Signal, number> = {
	SIGHUP: 1,
	SIGINT: 2,
	SIGKILL: 9,
	SIGTERM: 15
};

let registeredProcesses: ChildProcess[] = [];

/**
 * Adds a child process to the registered process list.
 *
 * The child processes in this list are covered by the exit logic of {@link exit}.
 *
 * @param childProcess - the child process you want to add to the registered process list
 */
export function addChildProcess(childProcess: ChildProcess): boolean {
	if (registeredProcesses.includes(childProcess)) return false;
	registeredProcesses = [...registeredProcesses, childProcess];
	return true;
}

/**
 * Removes a child process from the registered process list.
 *
 * The child processes in this list are covered by the exit logic of {@link exit}.
 *
 * @param childProcess - the child processes you want to remove the registered process list
 */
export function removeChildProcess(childProcess: ChildProcess): boolean {
	if (!registeredProcesses.includes(childProcess)) return false;
	registeredProcesses = registeredProcesses.filter(
		current => current !== childProcess
	);
	return true;
}

/**
 * Returns the registered child processes that are covered by the exit logic of {@link exit}.
 */
export function getChildProcesses(): ChildProcess[] {
	return [...registeredProcesses];
}

/**
 * Options for the {@link exit} function.
 */
export interface ExitOptions {
	/**
	 * When `true`, synchronously exit the main process with the child processes.
	 * (see note in {@link exit})
	 */
	withMain: boolean;

	/**
	 * The timeout in milliseconds to wait before forcefully killing the child processes with `SIGKILL`.
	 */
	exitTimeout: number;

	/**
	 * Event handler that gets called once all child processes are gone.
	 * @param forcefully - is `true`, when the children are forcefully killed
	 */
	onSuccess?: (forcefully: boolean) => void;
}

/**
 * Default values for the options of {@link exit}.
 */
export const defaultExitOptions: ExitOptions = {
	withMain: false,
	exitTimeout: 9000
};

let signalSent = false;
let succeeded = false;
let exitTimeoutId: NodeJS.Timeout | null = null;

/**
 * Sends a request to all child processes that they should exit with the specified exit code.
 * If the {@link exitTimeout} is exceeded, the child processes are killed forcefully with `SIGKILL`.
 *
 * > Note: This command **doesn't** exit the main node process.
 * > This is discouraged because some asynchronous operations may not finished yet.
 * > See https://nodejs.org/dist/latest-v16.x/docs/api/process.html#processexitcode.
 * > If you want to kill the main process too, set the `withMain` flag.
 *
 * @param code - the code the child processes receive on exit
 * @param options - additional parameters to configure the exit procedure
 */
export function exit(
	code: Signal | number = 'SIGHUP',
	options: Partial<ExitOptions> = {}
): void {
	const finalOptions = { ...defaultExitOptions, ...options };
	logger.debug('Exit options:', finalOptions);
	const runningProcesses = registeredProcesses.filter(
		childProcess => !childProcess.exitCode
	);
	logger.debug(`Found ${runningProcesses.length} running child processes`);

	// When all children are gone, go too.
	// SIGKILL has a special role:
	// It kills the child processes directly without waiting for proper exit of all child processes.
	if (
		code === 'SIGKILL' ||
		registeredProcesses.every(childProcess => !!childProcess.exitCode)
	) {
		if (code === 'SIGKILL')
			logger.warn('SIGKILL requested. Kill all child processes and exit');
		if (succeeded) {
			logger.info('Exit already succeeded. Ignoring request');
			return;
		}
		succeeded = true;

		logger.info('Exit succeeded. Emit event');
		if (exitTimeoutId) clearTimeout(exitTimeoutId);
		finalOptions.onSuccess?.(code === 'SIGKILL');
		// Calling `process.exit` directly to gracefully end the main process is discouraged.
		// Instead, return and let the user decide, when the main process should end.
		// see https://nodejs.org/dist/latest-v16.x/docs/api/process.html#processexitcode
		if (finalOptions.withMain)
			process.exit(typeof code === 'number' ? code : 128 + signalCodes[code]);
		return;
	}

	if (signalSent) {
		logger.info('Exit already in progress. Ignoring request');
		return;
	}
	signalSent = true;

	logger.info(`Exit with signal ${code} requested`);
	runningProcesses.forEach(childProcess => {
		childProcess.on('exit', () => exit(code, finalOptions));
		childProcess.kill(code);
	});

	// setup timeout to forcefully kill child processes after exit timeout
	exitTimeoutId = setTimeout(
		() => exit('SIGKILL', finalOptions),
		finalOptions.exitTimeout
	);
}

/**
 * Registers custom event handlers that get called once the main process receives exit signals.
 * (`SIGHUP`, `SIGINT`, `SIGTERM`)
 *
 * First, it calls the {@link exit} function to inform and wait on child processes.
 * After they're gone, it waits the additional cleanup time before exiting the main process.
 *
 * This gives the user an upper bound on the main process exit time.
 * (sum of `exitTimeout` and `cleanupTimeout`)
 *
 * Use this function if you have long-running child processes
 * and the user can interrupt the main process via kill signals.
 *
 * @param exitTimeout - time in milliseconds to wait before killing the child processes
 * @param cleanupTimeout - time in milliseconds to wait before existing the main process on a received interrupt
 */
export function registerEventHandlers(
	exitTimeout = 4500,
	cleanupTimeout = 500
) {
	const onSuccess = (signal: Signal) => {
		logger.debug(
			`All child processes gone. Wait ${cleanupTimeout} ms to finish asynchronous tasks`
		);
		setTimeout(() => process.exit(128 + signalCodes[signal]), cleanupTimeout);
	};

	let triggered = false;
	const exitWithTimeout = (signal: Signal) => {
		if (triggered) return;
		triggered = true;
		logger.debug(`Exit due to main process signal ${signal}`);
		exit(signal, { exitTimeout, onSuccess: () => onSuccess(signal) });
	};

	process.on('SIGHUP', () => exitWithTimeout('SIGHUP'));
	process.on('SIGINT', () => exitWithTimeout('SIGINT'));
	process.on('SIGTERM', () => exitWithTimeout('SIGTERM'));

	// capture Ctrl+C on process.stdin
	const readlineInterface = createInterface({
		input: process.stdin,
		output: process.stdout
	});
	readlineInterface.on('SIGINT', () => process.emit('SIGINT'));

	logger.info('Signal event handlers registered');
}
