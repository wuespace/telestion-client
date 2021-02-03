import { BaseMessage } from './base-message';
import { Headers } from './headers';
import type { Callback } from './callback';

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
