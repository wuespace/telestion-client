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
	[key: string]: any;
}

/**
 * message that is sent to and received by the event bus
 */
export interface BaseMessage {
	type: 'ping' | 'register' | 'unregister' | 'publish' | 'send' | 'rec' | 'err';
}

export interface AddressableMessage extends BaseMessage {
	address: string;
	headers: Headers;
	replyAddress?: string;
	reply?: (message: any, callback: Callback, headers?: Headers) => void;
}

export interface ContentMessage extends AddressableMessage {
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
	failureCode: number;
	failureType: string;
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
 * @example ```ts
 * // some vertx channel
 * const channel = 'VERTX_CHANNEL';
 *
 * const eventBus = new EventBus('http://localhost:8081/');
 *
 * eventBus.onopen = () => {
 *   eventBus.registerHandler(channel, (message, error) => {
 *     if (message) {
 *       console.log('Received message:', message);
 *     } else {
 *       console.error('Received error:', error);
 *     }
 *   });
 * };
 * ```
 */
export type Callback = (
	message: ReceiveMessage | null,
	error: ErrorMessage | null
) => void;
