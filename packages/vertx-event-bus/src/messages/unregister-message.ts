import { AddressableMessage } from './addressable-message';

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
