import { ContentMessage } from './content-message';

/**
 * a message that is received from the event bus containing new information
 */
export interface ReceiveMessage extends ContentMessage {
	type: 'rec';
}
