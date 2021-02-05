const spawn = require('child_process').spawn;

/**
 * Opens the `url` in the system's native browser
 * @param {string} url
 */
function openUrl(url) {
	let command = '';

	switch (process.platform) {
		case 'darwin':
			command = 'open';
			break;
		case 'win32':
			command = 'explorer.exe';
			break;
		case 'linux':
			command = 'xdg-open';
			break;
		default:
			throw new Error('Unsupported platform: ' + process.platform);
	}

	spawn(command, [url]);
}

module.exports = openUrl;
