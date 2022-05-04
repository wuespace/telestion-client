import { ChildProcess, fork } from 'child_process';
import { join } from 'path';

import { getLogger } from '../lib/index.mjs';
import { BuildEvent } from '../model/parcel-events.mjs';

const logger = getLogger('Parcel Action');

export interface ParcelOptions {
	/**
	 * The port to development server uses to wait for incoming connections. (web server port)
	 */
	port: number;
}

export const defaultParcelOptions: ParcelOptions = {
	port: 3100 // move away from default ports used by other tools
};

/**
 * Runs Parcel in build mode.
 * @param projectDir path to the project directory
 * @param options additional build options
 */
export async function build(
	projectDir: string,
	options: Partial<ParcelOptions> = {}
): Promise<void> {
	const finalOptions = { ...defaultParcelOptions, ...options };
	logger.debug('Project directory:', projectDir);
	logger.debug('Bundler options:', finalOptions);

	return new Promise<void>((resolve, reject) => {
		const process = forkParcel(projectDir, ['build', '--no-autoinstall']);
		process.on('exit', code => (code === 0 ? resolve() : reject()));
	});
}

/**
 * Starts Parcel in serve mode.
 * @param projectDir path to the project directory
 * @param options additional build and serve options
 * @param onEvent gets called when a build event has happened
 * @param onExit gets called when the Parcel serve process has stopped
 * @return a function that stops the Parcel serve process
 */
export function serve(
	projectDir: string,
	options: Partial<ParcelOptions>,
	onEvent: (event: BuildEvent) => void = () => {},
	onExit: (success: boolean) => void = () => {}
): () => boolean {
	const finalOptions = { ...defaultParcelOptions, ...options };
	logger.debug('Project directory:', projectDir);
	logger.debug('Bundler options:', finalOptions);

	const process = forkParcel(projectDir, [
		'serve',
		'--port',
		`${options.port}`,
		'--no-autoinstall'
	]);

	// register event handlers
	process.on('message', (event: BuildEvent) => onEvent(event));
	process.on('exit', code => onExit(code === 0));

	return () => process.kill();
}

/**
 * Starts a Parcel process via Node forking.
 * @param workingDir the directory in which Parcel should be started
 * @param args additional arguments for the Parcel process
 */
export function forkParcel(
	workingDir: string,
	args: string[] = []
): ChildProcess {
	const parcelBinary = join('node_modules', 'parcel', 'lib', 'cli.js');

	logger.debug('Parcel working directory:', workingDir);
	logger.debug('Parcel binary path:', parcelBinary);
	logger.debug('Parcel arguments:', args);

	logger.debug('Fork parcel process');
	const process = fork(parcelBinary, args, {
		cwd: workingDir,
		serialization: 'json',
		silent: false
	});
	logger.debug('Forked process:', process);
	return process;
}
