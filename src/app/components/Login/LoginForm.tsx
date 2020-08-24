import React, { useCallback, useEffect, useState } from 'react';
import { Form, TextField, Button, View } from '@adobe/react-spectrum';

import ValidationState from '../../../model/ValidationState';
import { isValidHttpUrl, isValidText } from '../../../lib/isValid';

const DEFAULT_SERVER_URL = 'http://localhost:8081/bridge';

interface Props {
	login: (username: string, password: string, serverUrl: string) => void;
}

export default function LoginForm({ login }: Props) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [serverUrl, setServerUrl] = useState(DEFAULT_SERVER_URL);
	const [usernameIsValid, setUsernameIsValid] = useState<ValidationState>();
	const [passwordIsValid, setPasswordIsValid] = useState<ValidationState>();
	const [serverUrlIsValid, setServerUrlIsValid] = useState<ValidationState>();

	useEffect(() => {
		setUsernameIsValid(isValidText(username));
	}, [username]);
	useEffect(() => {
		setPasswordIsValid(isValidText(password));
	}, [password]);
	useEffect(() => {
		setServerUrlIsValid(isValidHttpUrl(serverUrl));
	}, [serverUrl]);

	const handleLogin = useCallback(() => {
		if (usernameIsValid && passwordIsValid && serverUrlIsValid) {
			login(username, password, serverUrl);
		}
	}, [
		login,
		password,
		passwordIsValid,
		serverUrl,
		serverUrlIsValid,
		username,
		usernameIsValid
	]);

	return (
		<>
			<Form maxWidth="100%" isRequired>
				<TextField
					autoFocus
					label="Backend Server"
					placeholder="Server URL"
					value={serverUrl}
					onChange={setServerUrl}
					validationState={serverUrlIsValid}
				/>
				<TextField
					label="Username"
					placeholder="Your username"
					value={username}
					onChange={setUsername}
					validationState={usernameIsValid}
				/>
				<TextField
					label="Password"
					placeholder="Your Password"
					type="password"
					value={password}
					onChange={setPassword}
					validationState={passwordIsValid}
				/>
			</Form>
			<View marginTop="size-150">
				<Button variant="cta" onPress={handleLogin}>
					Login
				</Button>
			</View>
		</>
	);
}
