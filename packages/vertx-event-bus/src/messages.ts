/**
 * type for a valid message to transfer via the event bus
 */
export type JsonSerializable =
	| number
	| string
	| boolean
	| Map<string, JsonSerializable>
	| Array<JsonSerializable>;

/**
 * headers that are sent with event bus messages
 */
export interface Headers {
	[key: string]: unknown;
}

/**
 * a generic message that is sent to and received by the event bus
 */
export interface BaseMessage {
	/**
	 * every message must have a type
	 * so backend and frontend can differentiate
	 * between received and sent messages
	 */
	type: 'ping' | 'register' | 'unregister' | 'publish' | 'send' | 'rec' | 'err';
}

/**
 * a message that is addressable to a specific locations on the event bus
 */
export interface AddressableMessage extends BaseMessage {
	/**
	 * the address of a event bus location registered to the backend
	 */
	address: string;
	/**
	 * additional headers that will be sent with the message
	 */
	headers: Headers;
	/**
	 * optional reply address to send a message back
	 *
	 * very useful for a send-receive pattern
	 * where a backend node sends a message and waits for a receiving message
	 */
	replyAddress?: string;
	/**
	 * Sends a message back to the sender with a actual content.
	 * @param message - the content that will be sent with the message
	 * @param callback - a callback function that will be invoked
	 * if the sender reply again.
	 * @param headers - additional headers to send with the message
	 *
	 * @example
	 * ```ts
	 * eb.registerHandler('awesome-channel', message => {
	 * 	if (message.replyAddress) {
	 * 		console.log(message.body); // ping
	 * 		message.reply('pong', () => {});
	 * 	}
	 * });
	 * ```
	 */
	// not possible to fix because of circular dependencies
	// eslint-disable-next-line no-use-before-define
	reply?: (message: any, callback: Callback, headers?: Headers) => void;
}

/**
 * a message with actual content that will be transferred with the message
 */
export interface ContentMessage extends AddressableMessage {
	/**
	 * the content that will be transferred with the message
	 */
	body: JsonSerializable;
}

/**
 * a basic message that is sent
 * to prove to the backend server that the client is still connected
 */
export interface PingMessage extends BaseMessage {
	type: 'ping';
}

/**
 * a message that is sent to the backend server
 * to register to a specific channel
 * to receive future messages from the event bus from this specific channel
 *
 * to unregister or unsubscribe from the channel,
 * use {@link UnregisterMessage}
 */
export interface RegisterMessage extends AddressableMessage {
	type: 'register';
}

/**
 * a message that is sent to the backend server
 * to unregister or unsubscribe from a specific channel
 * to not receive any further messages from this channel
 *
 * to register to a channel, use {@link RegisterMessage}
 */
export interface UnregisterMessage extends AddressableMessage {
	type: 'unregister';
}

/**
 * a message that gets broadcasted on a specified channel
 */
export interface PublishMessage extends ContentMessage {
	type: 'publish';
}

/**
 * a message that is sent on the specified channel
 * containing a reply address gets sent
 */
export interface SendMessage extends ContentMessage {
	type: 'send';
}

/**
 * a message that is received from the event bus containing new information
 */
export interface ReceiveMessage extends ContentMessage {
	type: 'rec';
}

/**
 * a message that is received from the event bus if something went wrong
 */
export interface ErrorMessage extends AddressableMessage {
	type: 'err';
	/**
	 * the failure code of the received error
	 */
	failureCode: number;
	/**
	 * additional error type of the received message
	 */
	failureType: string;
	/**
	 * additional information about the received error
	 */
	message: string;
}

/**
 * a message sent to and received from the event bus
 */
export type Message =
	| PingMessage
	| RegisterMessage
	| UnregisterMessage
	| PublishMessage
	| SendMessage
	| ReceiveMessage
	| ErrorMessage;

/**
 * a function that is used as event handlers
 * in the event bus when receiving messages
 *
 * @see {@link EventBus}
 * @see {@link EventBus.setupConnection | setupConnection (here socket.onmessage)}
 *
 * @example
 * ```ts
 * // some vertx channel
 * const channel = 'VERTX_CHANNEL';
 *
 * const eventBus = new EventBus('http://localhost:8081/');
 *
 * eventBus.onopen = () => {
 * 	eventBus.registerHandler(channel, (message, error) => {
 * 		if (message) {
 * 			console.log('Received message:', message);
 * 		} else {
 * 			console.error('Received error:', error);
 * 		}
 * 	});
 * };
 * ```
 */
export type Callback = (
	message: ReceiveMessage | null,
	error: ErrorMessage | null
) => void;
