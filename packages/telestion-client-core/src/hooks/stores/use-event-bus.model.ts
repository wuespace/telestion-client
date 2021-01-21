import { State } from 'zustand';
import { ErrorMessage, EventBus, Options } from '@wuespace/vertx-event-bus';

/**
 * The connection state type of an event bus.
 *
 * * Possible states:
 * - `'connected'` if the eventbus is currently connected
 * to the backend server
 * - `'disconnected'` if the eventbus is currently disconnected
 * from the backend server
 * - `'error'` if the eventbus is currently open
 * and an error message was received
 * - `'noEventBus'` - if currently no event bus exists
 *
 * @see {@link EventBusState.connectionState}
 */
export type ConnectionState =
	| 'connected'
	| 'disconnected'
	| 'error'
	| 'noEventBus';

/**
 * The event bus state and actions of the Telestion Client Core.
 *
 * Defines the event bus store and function to open and close an event bus.
 *
 * @see {@link EventBusState.eventBus}
 * @see {@link EventBusState.openEventBus}
 * @see {@link EventBusState.closeEventBus}
 */
export interface EventBusState extends State {
	/**
	 * the current eventbus instance if an event bus was opened
	 * otherwise it is `null`
	 *
	 * **Notice**:
	 *
	 * Please use the instance object for special purposes only!
	 * It can lead to weird bugs tricky to resolve
	 * because the object does not change its identity once it is created.
	 * React instead is based on detecting changes and only re-renders
	 * if a value identity has changed causing differences in ui and app states.
	 *
	 * @see {@link @wuespace/vertx-event-bus#EventBus}
	 */
	eventBus: EventBus | null;

	/**
	 * the current connection state of the event bus
	 *
	 * @see {@link ConnectionState}
	 */
	connectionState: ConnectionState;

	/**
	 * optional error message
	 * if something gone wrong on connection setup or teardown
	 */
	error: string | null;

	/**
	 * the last received error message through the event bus connection
	 */
	lastErrorMessage: ErrorMessage | null;

	/**
	 * Creates a new event bus which will automatically connect to the server URL
	 * and opens a connection.
	 * @param serverUrl - the URL of the backend part to connect to
	 * @param options - options to configure the connection of the event bus
	 *
	 * @throws if {@link openEventBus} was called earlier
	 * and an eventbus instance already opened
	 *
	 * @see {@link closeEventBus}
	 * @see {@link eventBus}
	 * @see {@link connectionState}
	 *
	 * @example
	 * Open an event bus
	 * ```ts
	 * const open = useEventBus(state => state.openEventBus);
	 * return (
	 *    <button onClick={() => open('http://localhost:9870/bridge/')}>
	 *        Open event bus
	 *    </button>
	 * );
	 * ```
	 */
	openEventBus: (serverUrl: string, options?: Options) => void;

	/**
	 * Closes the current event bus and deletes it.
	 *
	 * @throws if {@link closeEventBus} was called earlier
	 * and an eventbus instance already closed
	 *
	 * @see {@link openEventBus}
	 * @see {@link eventBus}
	 * @see {@link connectionState}
	 *
	 * @example
	 * Close an event bus
	 * ```ts
	 * const close = useEventBus(state => state.closeEventBus);
	 * return <button onClick={() =< close()}>Close event bus</button>;
	 * ```
	 */
	closeEventBus: () => void;
}
