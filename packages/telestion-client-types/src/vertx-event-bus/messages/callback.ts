import { JsonSerializable } from '../../json-serializable';

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
 * 	eventBus.registerHandler(channel, message => {
 * 		console.log('Received message:', message);
 * 	});
 * };
 * ```
 */
export type Callback<T extends JsonSerializable = JsonSerializable> = (
	content: T
) => void;
