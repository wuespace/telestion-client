import os from 'os';
import { getLogger } from '../logger/index.mjs';
import { spawn } from './child-process.mjs';

const logger = getLogger('Native');

/**
 * Opens the URL in the system's native browser.
 * @param url the URL to open
 */
export async function openUrl(url: URL): Promise<void> {
	let command: string;

	switch (os.type()) {
		case 'Darwin':
			command = 'open';
			break;
		case 'Windows_NT':
			command = 'explorer.exe';
			break;
		case 'Linux':
			command = 'xdg-open';
			break;
		default:
			throw new Error(
				`Cannot open url '${url.href}'. Unsupported platform: ${os.type()}`
			);
	}

	logger.debug(
		`Open URL '${
			url.href
		}' on platform '${os.type()}' with command '${command}'`
	);
	await spawn(command, [url.href]);
}
