import { ContentMessage } from './content-message';

/**
 * a message that gets broadcasted on a specified channel
 */
export interface PublishMessage extends ContentMessage {
	type: 'publish';
}
