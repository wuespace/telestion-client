import { Options } from '@wuespace/telestion-client-types';

/**
 * the default options for the event bus
 * that are merged with the custom options in the constructor
 *
 * @see {@link (EventBus:constructor) | EventBus Constructor}
 *
 * @example
 * ```ts
 * constructor(url: string, options?: Partial<Options>) {
 * 	this.options = { ...defaultOptions, ...options };
 * 	...
 * }
 * ```
 */
export const defaultOptions: Options = {
	autoReconnect: true,
	pingInterval: 5000 /* ms */,
	reconnectAttempts: Infinity,
	reconnectExponent: 2,
	delayMin: 1000 /* ms */,
	delayMax: 5000 /* ms */,
	randomizationFactor: 0.5
};
