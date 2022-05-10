import { contextBridge, ipcRenderer } from 'electron';
import { readFileSync } from 'fs';

type IpcHandler = Parameters<typeof ipcRenderer.on>[1];

/**
 * the identification of registered handler (like `setTimeout`)
 */
export type HandlerId = number;

const channels: string[] = ['some-channel'];

// holds references to registered IPC handlers
const registeredHandlers: Array<IpcHandler> = [];

function registerHandler(
	channel: string,
	handler: (...args: any[]) => void
): HandlerId {
	// create handler and store it for later usage
	const id = registeredHandlers.push((event, ...args) => handler(...args)) - 1;
	// and register it
	ipcRenderer.on(channel, registeredHandlers[id]);

	return id;
}

function unregisterHandler(channel: string, id: HandlerId): boolean {
	if (id > 0 && id < registeredHandlers.length) {
		// unregister handler from IPC renderer via id
		ipcRenderer.removeListener(channel, registeredHandlers[id]);
		// and delete the stored reference
		delete registeredHandlers[id];

		return true;
	}

	return false;
}

contextBridge.exposeInMainWorld('ipc', {
	register: (channel: string, handler: (...args: any[]) => void): HandlerId => {
		// safety check if given channel is allowed in application
		if (channels.includes(channel)) {
			return registerHandler(channel, handler);
		}
		throw new TypeError(
			`Communication via channel ${channel} is not allowed in this application.`
		);
	},
	unregister: (channel: string, id: HandlerId): boolean => {
		// safety check if given channel is allowed in application
		if (channels.includes(channel)) {
			return unregisterHandler(channel, id);
		}
		throw new TypeError(
			`Communication via channel ${channel} is not allowed in this application.`
		);
	},
	registerOnce: (channel: string, handler: (...args: any[]) => void): void => {
		// safety check if given channel is allowed in application
		if (channels.includes(channel)) {
			ipcRenderer.once(channel, (event, ...args) => handler(...args));
			return;
		}
		throw new TypeError(
			`Communication via channel ${channel} is not allowed in this application.`
		);
	},
	send: (channel: string, ...args: any[]): void => {
		// safety check if given channel is allowed in application
		if (channels.includes(channel)) {
			ipcRenderer.send(channel, args);
			return;
		}
		throw new TypeError(
			`Communication via channel ${channel} is not allowed in this application.`
		);
	},
	invoke: (channel: string, ...args: any[]): Promise<any> => {
		console.log('Preload - invoke - channels:', channels);
		// safety check if given channel is allowed in application
		if (channels.includes(channel)) {
			return ipcRenderer.invoke(channel, args);
		}
		throw new TypeError(
			`Communication via channel ${channel} is not allowed in this application.`
		);
	}
});

contextBridge.exposeInMainWorld('environment', {
	platform: process.platform,
	arch: process.arch,
	chrome: process.versions.chrome,
	electron: process.versions.electron,
	node: process.version,
	creationTime: process.getCreationTime(),
	version: JSON.parse(readFileSync('package.json').toString())['version']
});
