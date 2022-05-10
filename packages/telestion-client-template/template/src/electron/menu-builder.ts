import {
	app,
	shell,
	BrowserWindow,
	Menu,
	MenuItemConstructorOptions
} from 'electron';

import IpcManager from './ipc-manager';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
	selector?: string;
	submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
	private readonly browserWindow: BrowserWindow;

	private readonly ipcManager: IpcManager;

	constructor(browserWindow: BrowserWindow, ipcManager: IpcManager) {
		this.browserWindow = browserWindow;
		this.ipcManager = ipcManager;
	}

	public buildMenu() {
		if (!app.isPackaged) {
			// Add mouse context menu in development mode
			this.setupDevelopmentEnvironment();
		}

		// build os specific menu template
		const template =
			process.platform === 'darwin'
				? this.buildDarwinTemplate()
				: this.buildDefaultTemplate();

		// generate template
		const menu = Menu.buildFromTemplate(template);

		Menu.setApplicationMenu(menu);
		return menu;
	}

	private setupDevelopmentEnvironment() {
		this.browserWindow.webContents.on('context-menu', (_, props) => {
			const { x, y } = props;

			Menu.buildFromTemplate([
				{
					label: 'Inspect element',
					click: () => {
						this.browserWindow.webContents.inspectElement(x, y);
					}
				}
			]).popup({ window: this.browserWindow });
		});
	}

	private buildDarwinTemplate(): MenuItemConstructorOptions[] {
		// define the different menu, submenus and their actions
		const subMenuAbout: DarwinMenuItemConstructorOptions = {
			label: 'Electron React Boilerplate',
			submenu: [
				{
					label: 'About Telestion Project Client',
					selector: 'orderFrontStandardAboutPanel:'
				},
				{ type: 'separator' },
				{
					label: 'Hide Telestion Project Client',
					accelerator: 'Command+H',
					selector: 'hide:'
				},
				{
					label: 'Hide Others',
					accelerator: 'Command+Shift+H',
					selector: 'hideOtherApplications:'
				},
				{ label: 'Show All', selector: 'unhideAllApplications:' },
				{ type: 'separator' },
				{
					label: 'Quit',
					accelerator: 'Command+Q',
					click: () => {
						app.quit();
					}
				}
			]
		};

		const subMenuEdit: DarwinMenuItemConstructorOptions = {
			label: 'Edit',
			submenu: []
		};

		const subMenuView: MenuItemConstructorOptions = {
			label: 'View',
			submenu: [
				{
					label: 'Toggle Full Screen',
					accelerator: 'Ctrl+Command+F',
					click: () => {
						this.browserWindow.setFullScreen(
							!this.browserWindow.isFullScreen()
						);
					}
				},
				...(!app.isPackaged
					? [
							{
								label: 'Reload',
								accelerator: 'Command+R',
								click: () => {
									this.browserWindow.webContents.reload();
								}
							},

							{
								label: 'Toggle Developer Tools',
								accelerator: 'Shift+Command+I',
								click: () => {
									this.browserWindow.webContents.toggleDevTools();
								}
							}
					  ]
					: [])
			]
		};

		const subMenuWindow: DarwinMenuItemConstructorOptions = {
			label: 'Window',
			submenu: [
				{
					label: 'Minimize',
					accelerator: 'Command+M',
					selector: 'performMiniaturize:'
				},
				{ label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
				{ type: 'separator' },
				{ label: 'Bring All to Front', selector: 'arrangeInFront:' }
			]
		};

		// concat all defined menu templates
		return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow];
	}

	private buildDefaultTemplate(): MenuItemConstructorOptions[] {
		return [
			{
				label: '&Window',
				submenu: [
					{
						label: '&Close',
						accelerator: 'Ctrl+W',
						click: () => {
							this.browserWindow.close();
						}
					},
					{
						label: '&Quit',
						accelerator: 'Ctrl+Q',
						click: () => {
							app.quit();
						}
					}
				]
			},
			{
				label: '&View',
				submenu: [
					{
						label: 'Toggle &Full Screen',
						accelerator: 'F11',
						click: () => {
							this.browserWindow.setFullScreen(
								!this.browserWindow.isFullScreen()
							);
						}
					},
					...(!app.isPackaged
						? [
								{
									label: 'Toggle &Developer Tools',
									accelerator: 'Shift+Ctrl+I',
									click: () => {
										this.browserWindow.webContents.toggleDevTools();
									}
								},
								{
									label: '&Reload',
									accelerator: 'Ctrl+R',
									click: () => {
										this.browserWindow.reload();
									}
								}
						  ]
						: [])
				]
			},
			{
				label: '&Help',
				submenu: [
					{
						label: 'Learn More',
						click: () => {
							shell.openExternal('https://telestion.wuespace.de/');
						}
					}
				]
			}
		];
	}
}
