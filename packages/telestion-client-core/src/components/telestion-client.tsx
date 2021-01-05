import { ReactNode, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StateSelector } from 'zustand';
import shallow from 'zustand/shallow';

import { Options } from '@wuespace/vertx-event-bus';
import {
	AuthState,
	ebOptionsPropTypes,
	EventBusState,
	PreferenceState,
	useAuth,
	useEventBus,
	usePreferences
} from '../hooks';

// zustand selectors
const authSelector: StateSelector<
	AuthState,
	{
		user: AuthState['user'];
		serverUrl: AuthState['serverUrl'];
	}
> = state => ({
	user: state.user,
	serverUrl: state.serverUrl
});

const eventBusSelector: StateSelector<
	EventBusState,
	{
		open: EventBusState['openEventBus'];
		close: EventBusState['closeEventBus'];
	}
> = state => ({
	open: state.openEventBus,
	close: state.closeEventBus
});

const preferencesSelector: StateSelector<
	PreferenceState,
	PreferenceState['setValue']
> = state => state.setValue;

export interface TelestionClientProps {
	/**
	 * the title of the application
	 *
	 * can be used with the {@link useTitle} hook
	 * to get a consistent state of the application
	 */
	title?: string;

	/**
	 * Additional wrapper function
	 * that will "wrap" the children into additional contexts, setups, hoc, etc.
	 * @param children the children components
	 * of the {@link TelestionClient} component
	 * @return a valid react node
	 */
	wrapper?: (children?: ReactNode) => ReactNode;

	/**
	 * additional options for the eventbus
	 * @see {@link Options}
	 */
	eventBusOptions?: Options;

	children: ReactNode;
}

/**
 * The main component of the Telestion Frontend.
 * Every part of the Telestion Frontend Application is a child
 * of this component.
 */
export const TelestionClient = ({
	title = 'Telestion Client',
	wrapper,
	eventBusOptions,
	children
}: TelestionClientProps) => {
	// set title as preference
	const update = usePreferences(preferencesSelector);

	useEffect(() => {
		update('null', 'title', title);
	}, [title, update]);

	// automatic eventbus management
	const { user, serverUrl } = useAuth(authSelector, shallow);
	const { open, close } = useEventBus(eventBusSelector, shallow);

	useEffect(() => {
		if (user && serverUrl) {
			// user authenticated -> open
			open(serverUrl, eventBusOptions);
			// on change of user, server url or options -> close first
			return () => close();
		}
	}, [user, serverUrl, eventBusOptions, open, close]);

	return <>{wrapper ? wrapper(children) : children}</>;
};

TelestionClient.propTypes = {
	title: PropTypes.string,
	wrapper: PropTypes.func,
	eventBusOptions: ebOptionsPropTypes
};
