import { useCallback, useState } from 'react';
import { Form, View } from '@adobe/react-spectrum';

import { TextField } from './text-field';
import { LoginButton } from './login-button';
import { isValidHttpUrl, isValidText } from '../../../../lib/validate-inputs';

export interface Submission {
	serverUrl: string;
	username: string;
	password: string;
}

export interface LoginFormProps {
	isLoading: boolean;

	onSubmit: (submission: Submission) => void;
}

export function LoginForm({ isLoading, onSubmit }: LoginFormProps) {
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
			<Form maxWidth="100%" isRequired isDisabled={isLoading}>
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
			</Form>

			<View marginTop="size-150">
				<LoginButton isLoading={isLoading} onPress={login} />
			</View>
		</>
	);
}
