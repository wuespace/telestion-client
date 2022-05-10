import { BrowserWindow, ipcMain } from 'electron';

/**
 * Builds an ipc manager for a browser window.
 */
export default class IpcManager {
	private readonly browserWindow: BrowserWindow;

	/**
	 * Creates a new IPC manager and bind to a browser window.
	 * @param browserWindow the browser window
	 */
	constructor(browserWindow: BrowserWindow) {
		this.browserWindow = browserWindow;
	}

	register() {
		ipcMain.on('some-channel', this.someAction);
		//ipcMain.on('another-channel', this.anotherAction);
	}

	unregister() {
		ipcMain.removeListener('some-channel', this.someAction);
		//ipcMain.removeListener('another-channel', this.anotherAction);
	}

	someAction() {
		console.log('Happy to be here!');
	}
}
