import { ReceiveMessage } from './receive-message';
import { ErrorMessage } from './error-message';

/**
 * a function that is used as event handlers
 * in the event bus when receiving messages
 *
 * @see {@link EventBus}
 * @see {@link EventBus.setupConnection | setupConnection (here socket.onmessage)}
 *
 * @example
 * ```ts
 * // some vertx channel
 * const channel = 'VERTX_CHANNEL';
 *
 * const eventBus = new EventBus('http://localhost:8081/');
 *
 * eventBus.onopen = () => {
 * 	eventBus.registerHandler(channel, (message, error) => {
 * 		if (message) {
 * 			console.log('Received message:', message);
 * 		} else {
 * 			console.error('Received error:', error);
 * 		}
 * 	});
 * };
 * ```
 */
export type Callback = (
	message: ReceiveMessage | null,
	error: ErrorMessage | null
) => void;
