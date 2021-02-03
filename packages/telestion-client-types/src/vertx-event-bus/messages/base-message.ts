/**
 * a generic message that is sent to and received by the event bus
 */
export interface BaseMessage {
	/**
	 * every message must have a type
	 * so backend and frontend can differentiate
	 * between received and sent messages
	 */
	type: 'ping' | 'register' | 'unregister' | 'publish' | 'send' | 'rec' | 'err';
}
