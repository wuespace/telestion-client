import { ContentMessage } from './content-message';

/**
 * a message that is sent on the specified channel
 * containing a reply address gets sent
 */
export interface SendMessage extends ContentMessage {
	type: 'send';
}
