import React, { useCallback, useEffect, useState } from 'react';
import { Form, TextField, Button, Flex } from '@adobe/react-spectrum';

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
		<Flex direction="column" gap="size-200">
			<Form maxWidth="size-3600" isRequired>
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
			{/* TODO: change button width */}
			<Button variant="cta" width="size-100" onPress={handleLogin}>
				Login
			</Button>
		</Flex>
	);
}
