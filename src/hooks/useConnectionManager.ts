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

export default function useConnectionManager() {
	const [{ credentials, authenticated }, authDispatch] = useAuthState();
	const [{ eventBus }, connectionDispatch] = useConnection();

	useEffect(() => {
		if (credentials) {
			if (!eventBus) {
				const eb = new EventBus(credentials.serverUrl);
				eb.enableReconnect(true);
				eb.onOpen = () => {
					console.log('%cEventbus opened', 'color: green; font-weight: bold');
					// change indicator to connected
					connectionDispatch(changeConnectionState('connected'));
					// TODO: add authentication
					// user is authenticated
					authDispatch(setAuthenticated());
					// authDispatch(setError('Invalid credentials'));
				};
				eb.onClose = () => {
					console.log('%cEventbus closed', 'color: red; font-weight: bold');
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

				// add eventbus to connection status
				connectionDispatch(newEventBus(eb));
			}
		} else {
			if (eventBus) {
				// user is no longer logged in
				connectionDispatch(deleteEventBus());
			}
		}
	}, [authDispatch, authenticated, connectionDispatch, credentials, eventBus]);
}
