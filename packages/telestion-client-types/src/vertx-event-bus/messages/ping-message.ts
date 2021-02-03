import { BaseMessage } from './base-message';

/**
 * a basic message that is sent
 * to prove to the backend server that the client is still connected
 */
export interface PingMessage extends BaseMessage {
	type: 'ping';
}
