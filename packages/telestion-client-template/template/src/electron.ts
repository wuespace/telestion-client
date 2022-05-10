import { fileURLToPath } from 'url';
import { app, BrowserWindow, shell } from 'electron';

import IpcManager from './electron/ipc-manager';
import MenuBuilder from './electron/menu-builder';

function installExtensions() {
	const installer = require('electron-devtools-installer');
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
	const extensions = ['REACT_DEVELOPER_TOOLS'];

	installer
		.default(
			extensions.map(name => installer[name]),
			forceDownload
		)
		.then((name: string) => console.log(`Added extension: ${name}`))
		.catch((err: any) => console.log('An error occurred:', err));
}

let mainWindow: BrowserWindow | null = null;

// noinspection JSIgnoredPromiseFromCall
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1024,
		height: 768,
		backgroundColor: '#ffffff',
		webPreferences: {
			nodeIntegration: false,
			nodeIntegrationInWorker: false,
			nodeIntegrationInSubFrames: false,
			contextIsolation: true,
			// disable devtools in packaged apps
			devTools: !app.isPackaged,
			spellcheck: false,
			// load built preload.js next to built electron.js
			preload: fileURLToPath(new URL('electron/preload.ts', import.meta.url))
		}
	});

	if (app.isPackaged) {
		// when packaged, the `electron.js` resides directly beside the compiled `index.html`
		// noinspection JSIgnoredPromiseFromCall
		mainWindow.loadFile('index.html');
	} else {
		// when run directly, parcel provides a development server at the specified port
		// noinspection JSIgnoredPromiseFromCall
		mainWindow.loadURL(`http://localhost:${process.env.DEV_SERVER_PORT}`);
	}

	// Open the DevTools.
	if (!app.isPackaged) mainWindow.webContents.openDevTools();

	// generate additional components
	const ipcManager = new IpcManager(mainWindow);
	const menuBuilder = new MenuBuilder(mainWindow, ipcManager);

	// and add them to the window
	ipcManager.register();
	menuBuilder.buildMenu();

	// remove menu from window
	// to activate, also comment out the buildMenu() method above
	//mainWindow.removeMenu();

	//
	// event handlers for this specific window
	//

	// Open urls in the user's browser
	mainWindow.webContents.setWindowOpenHandler(details => {
		// noinspection JSIgnoredPromiseFromCall
		shell.openExternal(details.url);
		return { action: 'deny' };
	});

	mainWindow.on('closed', () => {
		// remove all IPC handlers
		ipcManager.unregister();
	});
}

//
// app global events
//

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	// install additional devtools if in development mode
	if (!app.isPackaged) installExtensions();

	// create one window
	createWindow();

	app.on('activate', () => {
		// On macOS, it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
