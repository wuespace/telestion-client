import { Options } from '@wuespace/telestion-client-types';

/**
 * Optional parameters to configure the event bus manager.
 */
export interface EventBusManagerOptions {
	/**
	 * Optional parameters for the event bus instance.
	 *
	 * @see {@link @wuespace/telestion-client-types#Options}
	 */
	options?: Options;

	/**
	 * Gets called, when the event bus manager detects a valid authentication
	 * and opens an event bus connection.
	 */
	onOpen?: () => void;

	/**
	 * Gets called, when the event bus manager detects a change in authentication
	 * and closes the event bus connection.
	 */
	onClose?: () => void;
}
