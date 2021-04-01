import { BaseMessage } from './base-message';

/**
 * a message that is received from the event bus if something went wrong
 */
export interface ErrorMessage extends BaseMessage {
	type: 'err';
	/**
	 * the failure code of the received error
	 */
	failureCode: number;
	/**
	 * additional error type of the received message
	 */
	failureType: string;
	/**
	 * additional information about the received error
	 */
	message: string;
}
