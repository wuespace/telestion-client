import { ComponentLogger } from '@fliegwerk/logsemts';

/**
 * Options to configure the Vert.x mock server on creation.
 */
export interface VertxMockServerOptions {
	/**
	 * The prefix on which the event bus will be available.
	 *
	 * Defaults tp `'/bridge'`.
	 */
	prefix: string;

	/**
	 * The logging instance the mock server uses
	 * to print out connection and debug information.
	 *
	 * **Notice:**
	 * By default, the mock server does not print anything to console.
	 */
	logger: ComponentLogger;
}
