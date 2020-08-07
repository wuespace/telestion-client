import React, { useState } from 'react';
import { Flex, Heading, ProgressCircle } from '@adobe/react-spectrum';
import { useHistory } from 'react-router-dom';

import LoginForm from './LoginForm';

import authenticate from '../../../lib/authenticate';
import useAppState from '../../../hooks/useAppState';
import { LOGIN } from '../../../model/AppState';

export default function Login() {
	const [, dispatch] = useAppState();
	const history = useHistory();

	const [authenticating, setAuthenticating] = useState(false);

	const handleLogin = (username: string, password: string) => {
		setAuthenticating(true);
		authenticate(username, password, user => {
			setAuthenticating(false);
			if (user) {
				dispatch({ type: LOGIN, user });
				history.push('/dashboard');
			}
		});
	};

	return authenticating ? (
		<Flex gap="size-200">
			<ProgressCircle aria-label="Logging in…" isIndeterminate />
			<Heading level={2}>Logging in…</Heading>
		</Flex>
	) : (
		<Flex direction="column" gap="size-200">
			<Heading level={2}>Daedalus 2 - Groundstation</Heading>
			<LoginForm login={handleLogin} />
		</Flex>
	);
}
