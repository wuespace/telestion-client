import { useEffect } from 'react';
import { StateSelector } from 'zustand';
import shallow from 'zustand/shallow';
import { Options } from '@wuespace/vertx-event-bus';

import { AuthState, useAuth } from '../stores/use-auth';
import { EventBusState, useEventBus } from '../stores/use-event-bus';

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
 * @param options - options passed to the event bus instance to control it
 * and set it up
 *
 * @example
 * Commonly used as:
 * ```ts
 * import { TelestionClient, useEventBusManager } from '@wuespace/telestion-client-core';
 *
 * export function App() {
 * 	useEventBusManager({ pingInterval: 2000 });
 *
 * 	return (
 * 		<TelestionClient title="My Application">
 * 			...
 * 		</TelestionClient>
 * 	);
 * }
 * ```
 */
export function useEventBusManager(options?: Options): void {
	const auth = useAuth(authSelector);
	const { open, close } = useEventBus(eventBusSelector, shallow);

	useEffect(() => {
		if (auth) {
			open(auth.eventBusUrl, options);
			// on change of authentication -> close event bus
			return () => close();
		}
		return () => {};
	}, [auth, close, open, options]);
}
