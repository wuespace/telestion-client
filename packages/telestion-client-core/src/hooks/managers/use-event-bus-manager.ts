import { useEffect } from 'react';
import { StateSelector } from 'zustand';
import shallow from 'zustand/shallow';

import { AuthState, EventBusState, useAuth, useEventBus } from '../stores';
import { EventBusManagerOptions } from './use-event-bus-manager.model';

// zustand selectors
const authSelector: StateSelector<AuthState, AuthState['auth']> = state =>
	state.auth;

const eventBusSelector: StateSelector<
	EventBusState,
	{ open: EventBusState['openEventBus']; close: EventBusState['closeEventBus'] }
> = state => ({ open: state.openEventBus, close: state.closeEventBus });

/**
 * Handles the event bus creation automatically.
 *
 * It opens and closes the event bus
 * based on the application authentication state.
 *
 * If a user is logged in, the event bus will automatically be opened,
 * and if the user logs out again or nobody is logged in
 * the event bus will be closed.
 *
 * @param options - optional parameters to configure the event bus manager
 *
 * @example
 * Commonly used as:
 * ```ts
 * import { TelestionClient, useEventBusManager } from '@wuespace/telestion-client-core';
 *
 * export function App() {
 * 	useEventBusManager({
 * 		options: { pingInterval: 2000 },
 * 		onOpen: () => console.log('Open...'),
 * 		onClose: () => console.log('Close...')
 * 	});
 *
 * 	return (
 * 		<TelestionClient title="My Application">
 * 			...
 * 		</TelestionClient>
 * 	);
 * }
 * ```
 */
export function useEventBusManager(options: EventBusManagerOptions = {}): void {
	const { onOpen, onClose, options: ebOptions } = options;
	const auth = useAuth(authSelector);
	const { open, close } = useEventBus(eventBusSelector, shallow);

	useEffect(() => {
		if (auth) {
			open(auth.eventBusUrl, ebOptions);
			if (onOpen) onOpen();
			// on change of authentication -> close event bus
			return () => {
				close();
				if (onClose) onClose();
			};
		}
		return () => {};
	}, [auth, close, ebOptions, onClose, onOpen, open, options]);
}
