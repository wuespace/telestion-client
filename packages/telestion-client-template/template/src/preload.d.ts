import { HandlerId } from './electron/preload';

/**
 * This API exposes restricted access to the IPC between the render and main process.
 * You can use it to communicate to the main process and receive information from it.
 *
 * Example:
 * ```ts
 * function pingMainProcess() {
 *     if (!window.ipc) {
 *         console.log('IPC to main process not available.');
 *         return;
 *     }
 *
 *     window.ipc.send('some-channel', 'Ping');
 * }
 *
 * function register(cb: () => void): () => void {
 *     if (!window.ipc) {
 *         console.log('IPC to main process not available.');
 *         return () => {};
 *     }
 *
 *     const id = window.ipc.register('another-channel', cb);
 *     return () => window.ipc.unregister('another-channel', id);
 * }
 * ```
 */
interface IPC {
	/**
	 * Registers a handler to an IPC channel.
	 * The handler would be called if a new message arrives.
	 * <br>
	 * More information on the `ipcRenderer` module from electron:
	 * {@link Electron.ipcRenderer.on}
	 *
	 * @param channel the channel to listen to
	 * @param handler the handler function to register
	 * @returns the id of the registered function useful to {@link unregister} the handler later
	 *
	 * @see unregister
	 */
	register(channel: string, handler: (...args: any[]) => void): HandlerId;

	/**
	 * Unregisters a handler from an IPC channel with the specified id.
	 * <br>
	 * More information on the `ipcRenderer` module from electron:
	 * {@link Electron.ipcRenderer.removeListener}
	 *
	 * @param channel the channel which the handler currently listen to
	 * @param id the id of the registered handler returned from the {@link register} function
	 * @returns `true` if the handler was successfully removed
	 * and `false` if the handler was found on the given id
	 *
	 * @see register
	 */
	unregister(channel: string, id: HandlerId): boolean;

	/**
	 * Registers a one-time handler to an IPC channel.
	 * The handler is invoked only the next time a message arrives.
	 * <br>
	 * More information on the `ipcRenderer` module from electron:
	 * {@link Electron.ipcRenderer.once}
	 *
	 * @param channel the channel to listen to
	 * @param handler the handler function to register one-time
	 */
	registerOnce(channel: string, handler: (...args: any[]) => void): void;

	/**
	 * Send an asynchronous message to the main process via the specified channel, along with arguments.
	 * <br>
	 * More information on the `ipcRenderer` module from electron:
	 * {@link Electron.ipcRenderer.send}
	 *
	 * @param channel the channel to send to
	 * @param args additional arguments to send with the message
	 */
	send(channel: string, ...args: any[]): void;

	/**
	 * Send a message to the main process and expect a result asynchronously.
	 * <br>
	 * More information on the `ipcRenderer` module from electron:
	 * {@link Electron.ipcRenderer.invoke}
	 *
	 * @param channel the channel to send to
	 * @param args additional arguments to send with the message
	 */
	invoke(channel: string, ...args: any[]): Promise<any>;
}

/**
 * This API exposes the electron environment.
 *
 * Example:
 * ```ts
 * if (window.environment) {
 *     console.log('Current platform:', window.environment.platform);
 *     console.log('Current architecture:', window.environment.arch);
 *     console.log('Current Chrome version:', window.environment.chrome);
 *     console.log('Current Electron version:', window.environment.electron);
 *     console.log('Current Node version:', window.environment.node);
 * }
 * ```
 */
interface Environment {
	/**
	 * The `process.platform` property returns a string identifying the operating
	 * system platform on which the Node.js process is running.
	 */
	platform:
		| 'aix'
		| 'android'
		| 'darwin'
		| 'freebsd'
		| 'haiku'
		| 'linux'
		| 'openbsd'
		| 'sunos'
		| 'win32'
		| 'cygwin'
		| 'netbsd';

	/**
	 * The operating system CPU architecture for which the Node.js binary was compiled.
	 */
	arch:
		| 'arm'
		| 'arm64'
		| 'ia32'
		| 'mips'
		| 'mipsel'
		| 'ppc'
		| 'ppc64'
		| 's390'
		| 's390x'
		| 'x32'
		| 'x64';

	/**
	 * A `string` representing Chrome's version string.
	 */
	chrome: string;

	/**
	 * A `string` representing Electron's version string.
	 */
	electron: string;

	/**
	 * This property contains the Node.js version string.
	 */
	node: string;

	/**
	 * The number of milliseconds since epoch, or `null` if the information is unavailable.
	 */
	creationTime: number | null;

	/**
	 * The project version as stated in the `package.json`.
	 */
	version: string;
}

declare global {
	interface Window {
		ipc?: IPC;
		environment?: Environment;
	}
}
