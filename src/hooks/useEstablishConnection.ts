import useAppState from './useAppState';
import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import EventBus from 'vertx3-eventbus-client';
import { LOGIN, SET_CONNECTION_STATE } from '../model/AppState';
import User from '../model/User';
import userDashboards from '../lib/userDashboards';

export default function useEstablishConnection(): {
	authenticating: boolean;
	login: (serverUrl: string, username: string, password: string) => void;
	error: string | undefined;
} {
	const [, dispatch] = useAppState();
	const history = useHistory();

	const [authenticating, setAuthenticating] = useState(false);
	const [error, setError] = useState<string>();

	const login = useCallback(
		(serverUrl: string, username: string, password: string) => {
			setAuthenticating(true);
			console.log('Credentials', {
				username,
				password: password
					.split('')
					.map(() => '*')
					.join(''),
				serverUrl
			});
			// TODO: change user type
			const userType = 'admin';
			// create a eventbus with server address
			const eb = new EventBus(serverUrl);
			eb.enableReconnect(true);

			// build user object
			const user: User = {
				name: username,
				type: userType,
				eventBus: eb,
				dashboards: userDashboards[userType] || []
			};

			eb.onopen = () => {
				console.log('Eventbus opened');
				dispatch({ type: LOGIN, user });
				setAuthenticating(false);
				history.push('/dashboard');
			}

			eb.onclose = () => {
				console.log('Eventbus opened');
				dispatch({ type: SET_CONNECTION_STATE, connectionState: 'disconnected' });
				setError('Cannot connect to backend server. Is the server address correct?');
			}
		},
		[]
	);

	return { login, authenticating, error };
}
