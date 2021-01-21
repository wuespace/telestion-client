import { AddressableMessage } from './addressable-message';

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
