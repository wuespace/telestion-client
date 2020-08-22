import React, { useState } from 'react';
import {
	Flex,
	Heading,
	Text,
	Image,
	ProgressCircle
} from '@adobe/react-spectrum';
import { useHistory } from 'react-router-dom';

import LoginForm from './LoginForm';

import authenticate from '../../../lib/authenticate';
import useAppState from '../../../hooks/useAppState';
import { LOGIN } from '../../../model/AppState';

import logo from '../../media/logo.svg';

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
		<Flex direction="column" maxWidth="size-4600">
			<Image src={logo} alignSelf="center" alt="Daedalus 2 Logo" width="size-1200" />
			<Heading level={2}>Daedalus 2 - Ground Station</Heading>
			<Text>
				Please enter the credentials assigned to you by the Ground Station team
			</Text>
			<LoginForm login={handleLogin} />
		</Flex>
	);
}
