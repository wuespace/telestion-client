import { ChannelAddress } from '@wuespace/telestion-client-types';

/**
 * Generates a unique identifier for an address used as a reply address.
 * @returns a unique identifier for an address
 *
 * @see {@link EventBus.send}
 * @see {@link Message}
 *
 * @example
 * ```ts
 * const replyAddress = EventBus.generateUUID();
 *
 * const envelope: Message = {
 * 	type: 'send',
 * 	address,
 * 	headers: headers || {},
 * 	body: message,
 * 	replyAddress
 * };
 * ```
 */
export function generateUUID(): ChannelAddress {
	let b: number;
	// noinspection SpellCheckingInspection
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, a => {
		b = Math.random() * 16;
		// eslint-disable-next-line no-bitwise
		return (a === 'y' ? (b & 3) | 8 : b | 0).toString(16);
	});
}
