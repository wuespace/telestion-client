import { ErrorMessage, JsonSerializable } from '@wuespace/vertx-event-bus';

/**
 * Send a message to the event bus and get the first reply via a callback.
 */
export type SendFunction =
	/**
	 * @param message - the message that will be sent
	 * @param callback - the function that will be called
	 * when the reply returned from the eventbus
	 */
	(
		message: JsonSerializable,
		callback: (
			message: JsonSerializable | null,
			error: ErrorMessage | null
		) => void
	) => void;
