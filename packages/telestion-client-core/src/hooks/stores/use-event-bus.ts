import create, { UseStore } from 'zustand';
import { EventBus } from '@wuespace/vertx-event-bus';
import { getLogger } from '../../lib/logger';
import { EventBusState } from './use-event-bus.model';

const logger = getLogger('EventBus State');

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
	// eslint-disable-next-line max-lines-per-function
	(set, get) => ({
		eventBus: null,
		connectionState: 'noEventBus',
		error: null,
		lastErrorMessage: null,
		openEventBus: (serverUrl, options) => {
			logger.debug('Create and open event bus');
			let errorTimerId: NodeJS.Timeout;

			if (get().eventBus) {
				logger.error('Event bus already exists');
				throw new TypeError(
					'Eventbus is already created. No need to create another one.'
				);
			}

			const eb = new EventBus(serverUrl, options);
			eb.enableReconnect(true);

			eb.onOpen = () => {
				logger.success('Event bus opened!');
				set({ connectionState: 'connected' });
			};

			eb.onClose = () => {
				logger.warn('Could not connect to backend');
				if (errorTimerId) clearTimeout(errorTimerId);
				set({ connectionState: 'disconnected' });
			};

			eb.onError = message => {
				errorTimerId = setTimeout(() => {
					set({ connectionState: 'connected' });
				}, 2000);
				set({ connectionState: 'error', lastErrorMessage: message });
				logger.warn('Received error message:', message);
			};

			set({ eventBus: eb, connectionState: 'disconnected' });
		},
		closeEventBus: () => {
			logger.debug('Close event bus');
			if (!get().eventBus) {
				logger.error('Event bus already closed and removed');
				throw new TypeError(
					'Eventbus is already closed. Possible memory leak detected.'
				);
			}

			// close and delete
			get().eventBus?.close();
			set({ eventBus: null, connectionState: 'noEventBus' });
		}
	})
);
