import { FC, ReactNode, useEffect } from 'react';
import PropTypes from 'prop-types';
import shallow from 'zustand/shallow';

import { Options } from '../lib/vertx-event-bus';
import { useAuth, useEventBus, usePreferences } from '../hooks';

const authSelector = state => ({
	user: state.user,
	serverUrl: state.serverUrl
});

const eventBusSelector = state => ({
	open: state.openEventBus,
	close: state.closeEventBus
});

const preferencesSelector = state => state.update;

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
}

/**
 * The main component of the Telestion Frontend.
 * Every part of the Telestion Frontend Application is a child
 * of this component.
 */
const TelestionClient: FC<TelestionClientProps> = ({
	title = 'Telestion Client',
	wrapper,
	eventBusOptions,
	children
}) => {
	// set title as preference
	const update = usePreferences(preferencesSelector);

	useEffect(() => {
		update(title);
	}, [title, update]);

	// automatic eventbus management
	const { user, serverUrl } = useAuth(authSelector, shallow);
	const { open, close } = useEventBus(eventBusSelector, shallow);

	useEffect(() => {
		if (user) {
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
	eventBusOptions: PropTypes.shape({
		pingInterval: PropTypes.number,
		reconnectAttempts: PropTypes.number,
		reconnectExponent: PropTypes.number,
		delayMin: PropTypes.number,
		delayMax: PropTypes.number,
		randomizationFactor: PropTypes.number
	})
};

export { TelestionClient };
