import create, { UseStore } from 'zustand';
import { EventBus, ErrorMessage, Options } from '@wuespace/vertx-event-bus';
import { getLogger } from '../lib/logger';

const logger = getLogger('Connection State');

/**
 * the connection state type of an event bus
 *
 * @see {@link EventBusState.connectionState}
 */
export type ConnectionState = 'connected' | 'disconnected' | 'error';

/**
 * The event bus state and actions of the Telestion Client Core.
 *
 * Defines the event bus store and function to open and close an event bus.
 *
 * @see {@link EventBusState.eventBus}
 * @see {@link EventBusState.openEventBus}
 * @see {@link EventBusState.closeEventBus}
 */
export interface EventBusState extends Record<string, unknown> {
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
	 * if a value identity has changed causing different ui and app states.
	 *
	 * @see {@link @wuespace/vertx-event-bus#EventBus}
	 */
	eventBus: EventBus | null;

	/**
	 * the current connection state of the event bus
	 *
	 * Possible states:
	 * - `'connected'` if the eventbus is currently connected
	 * to the backend server
	 * - `'disconnected'` if the eventbus is currently disconnected
	 * from the backend server
	 * - `'error'` if the eventbus is currently open
	 * and an error message was received
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
	 * 	<button onClick={() => open('http://localhost:9870/bridge/')}>
	 * 		Open event bus
	 * 	</button>
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

/**
 * Returns the event bus state and actions to interact with.
 * A selector can be defined to pick out parts of the store.
 * If correctly set up, the function only triggers a rerender
 * if the selected values have changed.
 *
 * For more information about state management in Zustand,
 * take a look at their {@link https://github.com/pmndrs/zustand | GitHub page}.
 *
 * @param selector - optional selector function
 * which picks the specified elements out of the store
 * @param equalityFn - optional equality function
 * to check for state updates on the picked elements
 * @returns the picked elements in the selector function
 *
 * @see {@link EventBusState}
 * @see {@link https://github.com/pmndrs/zustand}
 * @see {@link UseStore}
 * @see {@link zustand#shallow}
 *
 * @example
 * Fetch current connection state from the store:
 * ```ts
 * // React component or hook context
 * const connectionState = usePreferences(state => state.connectionState);
 * return <p>Connection State: {connectionState}</p>;
 * ```
 *
 * Performance optimized and type-safe fetching from the store:
 * ```ts
 * import { useCallback, ReactNode } from 'react';
 * import { StateSelector } from 'zustand';
 * import shallow from 'zustand/shallow';
 * import {
 * 	useEventBus,
 * 	EventBusState
 * } from '@wuespace/telestion-client-core';
 * import { someRenderer } from './some-renderer';
 *
 * // selector does not depend on scope, so it's better to define it outside
 * // to not re-declare it on every render
 * const selector: StateSelector<
 * 	EventBusState,
 * 	{
 * 		open: EventBusState['openEventBus'],
 * 		close: PreferencesState['closeEventBus']
 * 	}
 * > = state => ({
 * 	open: state.openEventBus,
 * 	close: state.closeEventBus
 * });
 *
 * export function MyComponent(): ReactNode {
 * 	const { open, close } = useEventBus(selector, shallow);
 *
 * 	const openEB = useCallback(
 * 		() => open('http://localhost:9870/bridge/'),
 * 		[]
 * 	);
 *
 * 	const closeEB = useCallback(
 * 		() => close(),
 * 		[]
 * 	);
 *
 * 	return (
 * 		<div>
 * 			<button onClick={openEB}>Open event bus</button>
 * 			<button onClick={closeEB}>Close event bus</button>
 * 		</div>
 * 	);
 * }
 * ```
 */
export const useEventBus: UseStore<EventBusState> = create<EventBusState>(
	(set, get) => ({
		eventBus: null,
		connectionState: 'disconnected',
		error: null,
		lastErrorMessage: null,
		openEventBus: (serverUrl, options) => {
			let errorTimerId: NodeJS.Timeout;

			if (get().eventBus) {
				throw new TypeError(
					'Eventbus is already created. No need to create another one.'
				);
			}

			const eb = new EventBus(serverUrl, options);

			eb.onOpen = () => {
				eb.enableReconnect(true);
				set({ connectionState: 'connected' });
				logger.info('Eventbus opened');
			};

			eb.onClose = () => {
				if (errorTimerId) clearTimeout(errorTimerId);
				set({ connectionState: 'disconnected' });
				logger.warn('Eventbus closed');

				if (!eb.isReconnectEnabled) {
					// it's a connection error
					// close eventbus and delete it
					eb.close();
					set({ eventBus: null, error: 'Could not connect to server url' });
					logger.error('Could not connect to server url');
				}
			};

			eb.onError = message => {
				errorTimerId = setTimeout(() => {
					set({ connectionState: 'connected' });
				}, 2000);
				set({ connectionState: 'error', lastErrorMessage: message });
				logger.warn('Received error message:', message);
			};

			set({ eventBus: eb });
		},
		closeEventBus: () => {
			if (!get().eventBus) {
				throw new TypeError(
					'Eventbus is already closed. Possible memory leak detected.'
				);
			}

			// close and delete
			get().eventBus?.close();
			set({ eventBus: null });
		}
	})
);
