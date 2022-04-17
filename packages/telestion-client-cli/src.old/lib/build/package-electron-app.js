/**
 * Packages the app when called with process.cwd() as the PSC root directory.
 *
 * @return {Promise<string[]>} A list of produced artifacts
 */
function packageElectronApp() {
	const electronBuilder = require('electron-builder');
	return electronBuilder.build();
}

module.exports = packageElectronApp;
