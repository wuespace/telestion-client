import {
	ErrorMessage,
	JsonSerializable
} from '@wuespace/telestion-client-types';

/**
 * Sends a message to the event bus and get the first reply via a callback.
 *
 * @typeParam T - the type of the received data in the callback
 * (defaults to JSON serializable data)
 */
export type SendFunction<T extends JsonSerializable> =
	/**
	 * @param message - the message that will be sent
	 * @param callback - the function that will be called
	 * when the reply returned from the eventbus
	 */
	(
		message: JsonSerializable,
		callback: (message: T | null, error: ErrorMessage | null) => void
	) => void;
