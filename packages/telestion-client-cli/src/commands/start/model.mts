import { BaseOptions } from '../../model/index.mjs';
import { defaultServeOptions } from '../../actions/parcel.mjs';

export interface StartOptions extends BaseOptions {
	/**
	 * The output target the development server should use after it has started.
	 */
	target: 'electron' | 'browser';

	/**
	 * The port to development server uses to wait for incoming connections. (web server port)
	 */
	port: number;

	/**
	 * Open the browser after the development has started.
	 * (only useful on 'browser' target)
	 */
	open: boolean;
}

/**
 * Default options for template command.
 */
export const defaultOptions: Partial<StartOptions> = {
	target: 'electron',
	port: defaultServeOptions.port,
	open: true
};
