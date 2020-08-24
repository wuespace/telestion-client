import React, { useState } from 'react';
import {
	Flex,
	Heading,
	Text,
	Image,
	ProgressCircle,
	Well
} from '@adobe/react-spectrum';
import { useHistory } from 'react-router-dom';

import { LOGIN } from '../../../model/AppState';
import authenticate from '../../../lib/authenticate';

import useAppState from '../../../hooks/useAppState';
import logo from '../../media/logo.svg';
import LoginForm from './LoginForm';

export default function Login() {
	const [, dispatch] = useAppState();
	const history = useHistory();

	const [error, setError] = useState<string>();
	const [authenticating, setAuthenticating] = useState(false);

	const handleLogin = (
		username: string,
		password: string,
		serverUrl: string
	) => {
		setAuthenticating(true);
		authenticate(username, password, serverUrl)
			.then(user => {
				console.log('resolved');
				setAuthenticating(false);
				dispatch({ type: LOGIN, user });
				history.push('/dashboard');
			})
			.catch((err: string) => {
				console.log('rejected');
				setAuthenticating(false);
				setError(err);
			});
	};

	return authenticating ? (
		<Flex direction="column" justifyContent="center" alignItems="center">
			<ProgressCircle aria-label="Logging in" isIndeterminate />
			<Heading level={2}>Logging in…</Heading>
		</Flex>
	) : (
		<Flex direction="column" maxWidth="size-4600">
			<Image
				src={logo}
				alignSelf="center"
				alt="Daedalus 2 Logo"
				width="size-1200"
			/>
			<Heading level={2}>Daedalus 2 - Ground Station</Heading>
			<Text>
				Please enter the credentials assigned to you by the Ground Station team
			</Text>
			{error ? <Well>{error}</Well> : <></>}
			<LoginForm login={handleLogin} />
		</Flex>
	);
}
