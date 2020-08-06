const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
	// Create the browser window
	const win = new BrowserWindow({
		width: 800,
		minWidth: 480,
		height: 600,
		minHeight: 550,
		webPreferences: {
			nodeIntegration: true,
			spellcheck: false
		},
		autoHideMenuBar: true,
		darkTheme: true,
		titleBarStyle: 'hiddenInset'
	});

	// and load the index.html of the app.
	const startUrl = path.resolve(__dirname, './index.html');
	win.loadFile(startUrl);
	win.removeMenu();

	win.webContents.on('new-window', function (e, url) {
		e.preventDefault();
		require('electron').shell.openExternal(url);
	});
	// Open the devTools
	// win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Einige APIs können nur nach dem Auftreten dieses Events genutzt werden.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// Unter macOS ist es üblich, für Apps und ihre Menu Bar
	// aktiv zu bleiben, bis der Nutzer explizit mit Cmd + Q die App beendet.
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// Unter macOS ist es üblich ein neues Fenster der App zu erstellen, wenn
	// das Dock Icon angeklickt wird und keine anderen Fenster offen sind.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code.
