import os from 'node:os';
import { getLogger } from '../logger/index.mjs';
import { spawn } from './child-process.mjs';

const logger = getLogger('Native');

/**
 * Opens the URL in the system's native browser.
 * @param url the URL to open
 */
export async function openUrl(url: URL): Promise<void> {
	switch (os.type()) {
		case 'Darwin':
			logger.debug(
				`Open URL '${url.href}' on platform 'Darwin' with command 'open'`
			);
			await spawn('open', [url.href]);
			break;
		case 'Windows_NT':
			logger.debug(
				`Open URL '${url.href}' on platform 'Windows_NT' with command 'explorer.exe'`
			);
			await spawn('explorer.exe', [url.href]);
			break;
		case 'Linux':
			logger.debug(
				`Open URL '${url.href}' on platform 'Linux' with command 'xdg-open'`
			);
			await spawn('xdg-open', [url.href]);
			break;
		default:
			throw new Error(
				`Cannot open url '${url.href}'. Unsupported platform: ${os.type()}`
			);
	}
}
