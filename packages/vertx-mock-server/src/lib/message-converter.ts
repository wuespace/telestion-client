import {
	ChannelAddress,
	ErrorMessage,
	Headers,
	JsonSerializable,
	Message,
	ReceiveMessage
} from '@wuespace/telestion-client-types';
import { ErrorContent } from '../model';

/**
 * Encodes an event bus receive message that is usually received by the client.
 * @param channel - the channel of the message
 * @param content - the content of the message
 * @param headers - additional headers that are sent with the message
 * @returns the encoded message in an UTF-8 string
 *
 * @see {@link @wuespace/telestion-client-types#ReceiveMessage}
 *
 * @example
 * ```ts
 * const data = encodeReceiveMessage('my-channel', 'ping');
 * connection.write(data);
 * ```
 */
export function encodeReceiveMessage(
	channel: ChannelAddress,
	content: JsonSerializable,
	headers: Headers = {}
): string {
	const receiveMessage: ReceiveMessage = {
		type: 'rec',
		address: channel,
		headers,
		body: content
	};
	return JSON.stringify(receiveMessage);
}

/**
 * Encodes an event bus error message that is usually received by the client.
 * @param channel - the channel of the error message
 * @param content - the content of the error message
 * @param headers - additional headers that are sent with the message
 * @returns the encoded message in an UTF-8 string
 *
 * @see {@link @wuespace/telestion-client-types#ErrorMessage}
 *
 * @example
 * ```ts
 * const content = {
 * 	failureCode: 13,
 * 	failureType: 'Random data',
 * 	message: 'The box is not here!'
 * };
 *
 * const data = encodeErrorMessage('my-channel', content);
 * connection.write(data);
 * ```
 */
export function encodeErrorMessage(
	channel: ChannelAddress,
	content: ErrorContent,
	headers: Headers = {}
): string {
	const errorMessage: ErrorMessage = {
		type: 'err',
		address: channel,
		headers,
		failureCode: content.failureCode,
		failureType: content.failureType,
		message: content.message
	};
	return JSON.stringify(errorMessage);
}

/**
 * Decodes a raw message received from a client.
 * @param data - the raw message in a UTF-8 string format
 * @returns a valid event bus message
 *
 * @see {@link @wuespace/telestion-client-types#Message}
 *
 * @example
 * ```ts
 * connection.on('data', data => {
 * 	const message = decodeMessage(data);
 * 	if (message.type === 'publish') {
 * 		console.log('Message received:', message.body);
 * 	}
 * });
 * ```
 */
export function decodeMessage(data: string): Message {
	return JSON.parse(data);
}
