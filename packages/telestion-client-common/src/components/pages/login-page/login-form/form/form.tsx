import { useCallback, useState } from 'react';
import { Form as RSForm, View } from '@adobe/react-spectrum';

import { TextField } from './text-field';
import { LoginButton } from './login-button';
import { isValidHttpUrl, isValidText } from './validate-inputs';

export interface Submission {
	serverUrl: string;
	username: string;
	password: string;
}

export interface FormProps {
	isLoading: boolean;

	onSubmit: (submission: Submission) => void;
}

export function Form({ isLoading, onSubmit }: FormProps) {
	const [serverUrl, setServerUrl] = useState<string | null>('');
	const [username, setUsername] = useState<string | null>('');
	const [password, setPassword] = useState<string | null>('');

	const login = useCallback(() => {
		if (serverUrl && username && password) {
			onSubmit({ serverUrl, username, password });
		}
	}, [onSubmit, password, serverUrl, username]);

	return (
		<>
			<RSForm maxWidth="100%" isRequired isDisabled={isLoading}>
				<TextField
					autoFocus
					label="Backend Server"
					placeholder="Server URL"
					initialValue=""
					onChange={setServerUrl}
					validator={isValidHttpUrl}
				/>
				<TextField
					label="Username"
					placeholder="Your username"
					initialValue=""
					onChange={setUsername}
					validator={isValidText}
				/>
				<TextField
					label="Password"
					placeholder="Your password"
					type="password"
					initialValue=""
					onChange={setPassword}
					validator={isValidText}
				/>
			</RSForm>

			<View marginTop="size-150">
				<LoginButton
					isDisabled={!serverUrl || !username || !password}
					isLoading={isLoading}
					onPress={login}
				/>
			</View>
		</>
	);
}
