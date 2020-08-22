import React, { useCallback, useEffect, useState } from 'react';
import { Form, TextField, Button, View } from '@adobe/react-spectrum';

function isValid(input: string) {
	return input.length > 0;
}

interface Props {
	login: (username: string, password: string) => void;
}

export default function LoginForm({ login }: Props) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [usernameValid, setUsernameValid] = useState(true);
	const [passwordValid, setPasswordValid] = useState(true);

	useEffect(() => {
		setUsernameValid(true);
	}, [username]);
	useEffect(() => {
		setPasswordValid(true);
	}, [password]);

	const handleLogin = useCallback(() => {
		if (!isValid(username)) setUsernameValid(false);
		if (!isValid(password)) setPasswordValid(false);

		if (isValid(username) && isValid(password)) {
			login(username, password);
		}
	}, [login, password, username]);

	return (
		<>
			<Form maxWidth="100%" isRequired>
				<TextField
					autoFocus
					label="Username"
					placeholder="Your username"
					value={username}
					onChange={setUsername}
					validationState={usernameValid ? 'valid' : 'invalid'}
				/>
				<TextField
					label="Password"
					placeholder="Your Password"
					type="password"
					value={password}
					onChange={setPassword}
					validationState={passwordValid ? 'valid' : 'invalid'}
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
