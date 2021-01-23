import { useMemo } from 'react';
import { StateSelector } from 'zustand';
import {
	AuthState,
	ConnectionState,
	EventBusState,
	useAuth,
	useEventBus
} from '@wuespace/telestion-client-core';

const authSelector: StateSelector<AuthState, AuthState['auth']> = ({ auth }) =>
	auth;

const eventBusSelector: StateSelector<EventBusState, ConnectionState> = ({
	connectionState
}) => connectionState;

const mapToState: { [key in ConnectionState]: string } = {
	connected: 'Connected with backend server',
	disconnected: 'Disconnected from backend server',
	error: 'Error message received from backend server',
	noEventBus: 'No connection setup'
};

interface Scope {
	description: string;
	state: string;
}

export function useStatus(): Array<Scope> {
	const auth = useAuth(authSelector);
	const connectionStatus = useEventBus(eventBusSelector);

	return useMemo(() => {
		return [
			{
				description: 'Connection status',
				state: mapToState[connectionStatus]
			},
			{
				description: 'Account',
				state: auth
					? `Logged in with username '${auth.username}'`
					: 'Logged out'
			},
			{
				description: 'Authentication server',
				state: auth ? auth.authServerUrl : 'none'
			},
			{
				description: 'Event bus server',
				state: auth ? auth.eventBusUrl : 'none'
			}
		];
	}, [auth, connectionStatus]);
}
