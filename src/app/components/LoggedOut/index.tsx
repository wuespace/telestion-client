import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Flex, Heading, ProgressCircle } from '@adobe/react-spectrum';

import { LOGIN } from '../../../model/AppState';

import LoginForm from './LoginForm';
import useAppState from '../../../hooks/useAppState';
import authenticate from '../../../lib/authenticate';

export default function Login() {
	const [, dispatch] = useAppState();
	const [authenticating, setAuthenticating] = useState(false);
	const history = useHistory();

	const handleLogin = (username: string, password: string) => {
		setAuthenticating(true);
		authenticate(username, password, (auth) => {
			setAuthenticating(false);
			if (auth) {
				dispatch({ type: LOGIN, auth });
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
			<Heading level={2}>
				Daedalus 2 - Groundstation
			</Heading>
			<LoginForm login={handleLogin} />
		</Flex>
	);
}
