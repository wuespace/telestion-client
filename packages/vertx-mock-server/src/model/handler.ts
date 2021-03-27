import { JsonSerializable } from '@wuespace/telestion-client-types';

/**
 * The handler which gets called
 * when a {@link @wuespace/telestion-client-types#SendMessage}
 * arrives on the registered channel.
 *
 * @see {@link MockServer.handle}
 * @see {@link MockServer.unhandle}
 */
export type SendHandler = (
	/**
	 * The received message.
	 */
	message: JsonSerializable,
	/**
	 * The function to respond to the received message
	 * on the same channel.
	 */
	respond: (
		/**
		 * The message to respond with.
		 */
		response: JsonSerializable
	) => void
) => void;

/**
 * The id of a registered event handler which gets called
 * when a {@link @wuespace/telestion-client-types#SendMessage} is received.
 *
 * @see {@link SendHandler}
 */
export type SendHandlerId = number;

/**
 * The handler which gets called
 * when a {@link @wuespace/telestion-client-types#PublishMessage}
 * arrives on the registered channel.
 *
 * @see {@link MockServer.register}
 * @see {@link MockServer.unregister}
 */
export type PublishHandler = (
	/**
	 * The received message.
	 */
	message: JsonSerializable
) => void;

/**
 * The id of a registered event handler which gets called
 * when a {@link @wuespace/telestion-client-types#PublishMessage} is received.
 *
 * @see {@link PublishHandler}
 */
export type PublishHandlerId = number;
