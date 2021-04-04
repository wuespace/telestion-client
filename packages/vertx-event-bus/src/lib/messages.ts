import {
	ChannelAddress,
	ErrorMessage,
	Headers,
	JsonSerializable,
	PingMessage,
	PublishMessage,
	RegisterMessage,
	SendMessage,
	UnregisterMessage
} from '@wuespace/telestion-client-types';

/**
 * Builds a ping message.
 *
 * @example
 * ```ts
 * this.pingTimer = setInterval(
 * 	() => this.sandRaw(pingMessage()),
 * 	this.options.pingInterval
 * );
 * ```
 */
export function pingMessage(): PingMessage {
	return { type: 'ping' };
}

/**
 * Builds a register message.
 * @param address - the address which should be registered
 * @param headers - additional headers sent with the message
 * @returns a valid register message
 *
 * @example
 * ```ts
 * if (this.handlers.every(handler => handler[0] !== address)) {
 * 	this.bus.send(registerMessage(address, headers), false);
 * }
 * ```
 */
export function registerMessage(
	address: ChannelAddress,
	headers: Headers = {}
): RegisterMessage {
	return {
		type: 'register',
		address,
		headers
	};
}

/**
 * Builds an unregister message.
 * @param address - the address which should be unregistered
 * @param headers - additional headers sent with the message
 * @returns a valid unregister message
 *
 * @example
 * ```ts
 * if (this.handlers.every(handler => handler[0] !== address)) {
 * 	this.bus.send(unregisterMessage(address, headers), false);
 * }
 * ```
 */
export function unregisterMessage(
	address: ChannelAddress,
	headers: Headers = {}
): UnregisterMessage {
	return {
		type: 'unregister',
		address,
		headers
	};
}

/**
 * Builds a publish message.
 * @param address - the address of the message
 * @param content - the content to publish
 * @param headers - additional headers sent with the message
 * @returns a valid publish message
 *
 * @example
 * ```ts
 * this.bus.send(publishMessage(address, content, headers));
 * ```
 */
export function publishMessage(
	address: ChannelAddress,
	content: JsonSerializable,
	headers: Headers = {}
): PublishMessage {
	return {
		type: 'publish',
		address,
		body: content,
		headers
	};
}

/**
 * Builds a send message.
 * @param address - the address of the message
 * @param replyAddress - the reply address of the message
 * @param content - the content to send
 * @param headers - additional headers sent with the message
 * @returns a valid send message
 *
 * @example
 * ```ts
 * this.bus.send(sendMessage(address, replyAddress, content, headers));
 * ```
 */
export function sendMessage(
	address: ChannelAddress,
	replyAddress: ChannelAddress,
	content: JsonSerializable,
	headers: Headers = {}
): SendMessage {
	return {
		type: 'send',
		address,
		replyAddress,
		body: content,
		headers
	};
}

/**
 * Builds an error message.
 * @param failureCode - the failure code of the error
 * @param failureType - the failure type of the error
 * @param message - additional information on this error
 * @returns a valid error message
 *
 * @example
 * ```ts
 * try {
 * 	// something
 * } catch (err) {
 * 	this.onMessage?.(errorMessage(1, 'Error', 'Something happened'));
 * }
 * ```
 */
export function errorMessage(
	failureCode: number,
	failureType: string,
	message: string
): ErrorMessage {
	return {
		type: 'err',
		failureCode,
		failureType,
		message
	};
}
