import { Plugin } from '../model/plugin';
import { Awaitable } from '../model/awaitable';

/**
 * The plugins that get loaded into the Electron main process.
 */
export const plugins: Awaitable<Plugin>[] = [
	// Add your plugins here:
	// require('./my-plugin'),
	require('./test-plugin')
];
