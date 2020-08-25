import React from 'react';
import {
	Flex,
	Heading,
	Text,
	Image,
	Well
} from '@adobe/react-spectrum';

import { setCredentials } from '../../../model/AuthState';

import logo from '../../media/logo.svg';
import LoginForm from './LoginForm';

import useAuthState from '../../../hooks/useAuthState';

export default function Login() {
	const [{ error }, dispatch] = useAuthState();

	const handleLogin = (
		username: string,
		password: string,
		serverUrl: string
	) => {
		dispatch(setCredentials({ username, password, serverUrl }));
	};

	return (
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
