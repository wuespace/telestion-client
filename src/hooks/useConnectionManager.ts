import { useEffect } from 'react';
import EventBus from '../lib/vertxEventBus';

import {
	changeConnectionState,
	deleteEventBus,
	newEventBus
} from '../model/Connection';
import { setAuthenticated, setError } from '../model/AuthState';

import useAuthState from './useAuthState';
import useConnection from './useConnection';
import useLogger from './useLogger';

export default function useConnectionManager() {
	const logger = useLogger('Connection Manager');
	const [{ credentials, authenticated }, authDispatch] = useAuthState();
	const [{ eventBus }, connectionDispatch] = useConnection();

	useEffect(() => {
		if (credentials) {
			if (!eventBus) {
				const eb = new EventBus(credentials.serverUrl);
				eb.enableReconnect(true);
				eb.onOpen = () => {
					logger.success('Event bus opened');
					// change indicator to connected
					connectionDispatch(changeConnectionState('connected'));
					// TODO: add authentication
					// user is authenticated
					authDispatch(setAuthenticated());
					// authDispatch(setError('Invalid credentials'));
				};
				eb.onClose = () => {
					logger.info('Event bus closed');
					// change indicator to connected
					connectionDispatch(changeConnectionState('disconnected'));
					// set error and clear credentials if not authenticated
					if (!authenticated && eventBus) {
						authDispatch(
							setError(
								'Cannot connect to backend server. Is the server address correct?'
							)
						);
					}
				};

				eb.onError = err => {
					logger.error('Event bus error: ', err);
				};

				eb.onReconnect = () => {
					logger.info('Event bus has reconnected');
				};

				// add eventbus to connection status
				connectionDispatch(newEventBus(eb));
			}
		} else {
			if (eventBus) {
				// user is no longer logged in
				connectionDispatch(deleteEventBus());
			}
		}
	}, [
		authDispatch,
		authenticated,
		connectionDispatch,
		credentials,
		eventBus,
		logger
	]);
}
