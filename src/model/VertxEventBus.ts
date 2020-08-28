import JSONSerializable from './JSONSerializable';

/**
 * the default options for the event bus
 */
export interface Options {
	/**
	 * time between ping messages send to the backend server in milliseconds
	 */
	pingInterval: number;
	/**
	 * number of attempts to try to reconnect to backend server
	 * before no more reconnects are attempted
	 * if the connection is lost unexpectedly
	 */
	reconnectAttempts: number;
	/**
	 * exponent of the power function used to determine a new reconnect delay
	 * based on reconnect attempts
	 *
	 * for implementation details, see {@link EventBus.newReconnectDelay}
	 */
	reconnectExponent: number;
	/**
	 * minimum time to wait between reconnect attempts in milliseconds
	 */
	delayMin: number;
	/**
	 * maximum time to wait between reconnect attempts in milliseconds
	 */
	delayMax: number;
	/**
	 * randomization factor for the deviation
	 * used in the reconnect delay generator function
	 *
	 * for implementation details, see {@link EventBus.newReconnectDelay}
	 */
	randomizationFactor: number;
}

/**
 * headers that are send with event bus messages
 */
export interface Headers {
	[key: string]: any;
}

/**
 * message that is send to and received from the event bus
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
	body: JSONSerializable;
}

/**
 * a basic message that is send
 * to prove the backend server that the client is still connected
 */
export interface PingMessage extends BaseMessage {
	type: 'ping';
}

/**
 * a message that is send to the backend server
 * to register to a specific channel
 * to receive further messages from the event bus especially from this channel
 *
 * to unregister or unsubscribe from the channel again,
 * use {@link UnregisterMessage}
 */
export interface RegisterMessage extends AddressableMessage {
	type: 'register';
}

/**
 * a message that is send to the backend server
 * to unregister or unsubscribe from a specific channel
 * to not receive any further messages from the event bus
 * especially from this channel
 *
 * to register to a channel, use {@link RegisterMessage}
 */
export interface UnregisterMessage extends AddressableMessage {
	type: 'unregister';
}

/**
 * a message that is broadcast on the specified channel
 */
export interface PublishMessage extends ContentMessage {
	type: 'publish';
}

/**
 * a message that is sent on the specified channel
 * containing a reply address on this the reply are received
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
 * a message that is received from the event bus if something gone wrong
 */
export interface ErrorMessage extends AddressableMessage {
	type: 'err';
	failureCode: number;
	failureType: string;
	message: string;
}

/**
 * a message send to and received from the event bus
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
 * a function that are used as event handlers
 * in the event bus on receiving messages
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
