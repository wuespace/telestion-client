import { AddressableMessage } from './addressable-message';
import { JsonSerializable } from '../../json-serializable';

/**
 * a message with actual content that will be transferred with the message
 */
export interface ContentMessage extends AddressableMessage {
	/**
	 * the content that will be transferred with the message
	 */
	body: JsonSerializable;
}
