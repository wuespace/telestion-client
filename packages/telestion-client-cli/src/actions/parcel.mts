import { ChildProcess } from 'node:child_process';
import { join } from 'node:path';

import { CompositeError, existsSync, fork, getLogger } from '../lib/index.mjs';
import { BuildEvent } from '../model/parcel-events.mjs';

const logger = getLogger('Parcel Action');

export type BuildEventHandler = (
	event: BuildEvent,
	stop: () => void,
	parcelProcess: ChildProcess
) => Promise<void>;

interface BaseOptions {
	/**
	 * A list of targets that Parcel should compile.
	 * When `undefined` Parcel compiles all targets.
	 */
	targets: string[] | undefined;
}

export interface ServeOptions extends BaseOptions {
	/**
	 * The port to development server uses to wait for incoming connections. (web server port)
	 */
	port: number;
}

export interface WatchOptions extends BaseOptions {
	/**
	 * The port to development server uses to wait for incoming connections. (web server port)
	 */
	port: number;
}

export interface BuildOptions extends BaseOptions {
	// placeholder
}

export const defaultServeOptions: ServeOptions = {
	targets: undefined,
	port: 3100 // move away from default ports used by other tools,
};

export const defaultWatchOptions: WatchOptions = {
	targets: undefined,
	port: 3101 // move away from default ports used by other tools
};

export const defaultBuildOptions: BuildOptions = {
	targets: undefined
};

// TODO: Remove no-cache flag once Parcel no longer exits uncleanly
export const defaultParcelArgs: string[] = ['--no-autoinstall', '--no-cache'];

/**
 * Starts Parcel in serve mode and compiles the project based on the Parcel configuration
 * and the metadata in the `package.json`.
 * @param projectDir path to the project directory
 * @param options additional build and serve options
 * @param onEvent gets called when a build event has happened
 * @return a promise that fulfills once the Parcel process stops
 */
export async function serve(
	projectDir: string,
	options?: Partial<ServeOptions>,
	onEvent?: BuildEventHandler
): Promise<void> {
	const finalOptions = { ...defaultServeOptions, ...options };
	logger.debug('Project directory:', projectDir);
	logger.debug('Frontend serve options:', finalOptions);

	const targetArgs = finalOptions.targets
		? ['--target', `${finalOptions.targets.join(',')}`]
		: [];

	return new Promise<void>((resolve, reject) => {
		const parcelProcess = forkParcel(projectDir, [
			'serve',
			...defaultParcelArgs,
			'--port',
			`${finalOptions.port}`,
			...targetArgs
		]);

		const stop = () => {
			parcelProcess.kill('SIGTERM');
		};

		// register event handlers
		parcelProcess.on('message', (event: BuildEvent) => {
			onEvent?.(event, stop, parcelProcess).catch(err => {
				logger.debug('Error in serve event handler. Stop parcel serve');
				stop();
				reject(
					new CompositeError(
						`Build event in Parcel serve with options ${options} failed.`,
						err
					)
				);
			});
		});

		parcelProcess.on('exit', (code, signal) =>
			code === 0 || !!signal
				? resolve()
				: reject(
						new Error(
							`Parcel serve with options ${options} failed with exit code ${code} and signal ${signal}`
						)
				  )
		);
	});
}

/**
 * Starts Parcel in watch mode and compiles the project based on the Parcel configuration
 * and the metadata in the `package.json`.
 * @param projectDir path to the project directory
 * @param options additional build and watch options
 * @param onEvent gets called when a build event has happened
 * @return a promise that fulfills once the Parcel process stops
 */
export async function watch(
	projectDir: string,
	options?: Partial<WatchOptions>,
	onEvent?: BuildEventHandler
): Promise<void> {
	const finalOptions = { ...defaultWatchOptions, ...options };
	logger.debug('Project directory:', projectDir);
	logger.debug('Electron watch options:', finalOptions);

	const targetArgs = finalOptions.targets
		? ['--target', `${finalOptions.targets.join(',')}`]
		: [];

	return new Promise<void>((resolve, reject) => {
		const parcelProcess = forkParcel(projectDir, [
			'watch',
			...defaultParcelArgs,
			'--port',
			`${finalOptions.port}`,
			...targetArgs
		]);

		const stop = () => {
			parcelProcess.kill('SIGTERM');
		};

		// register event handlers
		parcelProcess.on('message', (event: BuildEvent) => {
			onEvent?.(event, stop, parcelProcess).catch(err => {
				logger.debug('Error in serve event handler. Stop parcel serve');
				stop();
				reject(
					new CompositeError(
						`Build event in Parcel watch with options ${options} failed.`,
						err
					)
				);
			});
		});

		parcelProcess.on('exit', (code, signal) =>
			code === 0 || !!signal
				? resolve()
				: reject(
						new Error(
							`Parcel watch with options ${options} failed with exit code ${code} and signal ${signal}`
						)
				  )
		);
	});
}

/**
 * Starts Parcel in build mode and compiles the project based on the Parcel configuration
 * and the metadata in the `package.json`.
 * @param projectDir path to the project directory
 * @param options additional build options
 */
export async function build(
	projectDir: string,
	options: Partial<BuildOptions> = {}
): Promise<void> {
	const finalOptions = { ...defaultBuildOptions, ...options };
	logger.debug('Project directory:', projectDir);
	logger.debug('Bundler options:', finalOptions);

	const targetArgs = finalOptions.targets
		? ['--target', `${finalOptions.targets.join(',')}`]
		: [];

	return new Promise<void>((resolve, reject) => {
		const parcelProcess = forkParcel(projectDir, [
			'build',
			...defaultParcelArgs,
			...targetArgs
		]);

		parcelProcess.on('exit', (code, signal) =>
			code === 0 || !!signal
				? resolve()
				: reject(
						new Error(
							`Parcel build with options ${options} failed with exit code ${code} and signal ${signal}`
						)
				  )
		);
	});
}

/**
 * Starts a Parcel process via Node forking.
 * @param workingDir the directory in which Parcel should be started
 * @param args additional arguments for the Parcel process
 */
export function forkParcel(workingDir: string, args?: string[]): ChildProcess {
	const parcelBinary = join(
		workingDir,
		'node_modules',
		'parcel',
		'lib',
		'cli.js'
	);

	logger.debug('Parcel working directory:', workingDir);
	logger.debug('Parcel binary path:', parcelBinary);
	logger.debug('Parcel arguments:', args);

	if (!existsSync(parcelBinary)) {
		throw new Error(
			'Parcel binary not found. Is Parcel installed in your project?'
		);
	}

	logger.debug('Fork parcel process');
	const childProcess = fork(parcelBinary, args, { cwd: workingDir });
	childProcess.stdout?.pipe(process.stdout);
	childProcess.stderr?.pipe(process.stderr);
	return childProcess;
}
