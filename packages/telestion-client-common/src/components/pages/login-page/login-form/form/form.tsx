/* eslint-disable max-lines-per-function */
import { useCallback, useState } from 'react';
import { Form as RSForm, View } from '@adobe/react-spectrum';

import { FormProps } from './form.model';
import { TextField } from './text-field';
import { LoginButton } from './login-button';
import { isValidHttpUrl, isValidText } from './validate-inputs';

/**
 * The form component that renders the react-spectrum login form
 * where the user enters his information and credentials to log in with.
 *
 * The user submits their login information
 * via the {@link FormProps.onSubmit} event.
 *
 * If the loading state is `true` all user input is blocked.
 *
 * @see {@link FormProps}
 *
 * @example
 * ```ts
 * function MyForm() {
 * 	const [isLoading, setIsLoading] = useState(false);
 *
 * 	const handleSubmit = (submission: Submission) => {
 * 		setIsLoading(true);
 * 		alert(`User ${submission.username} tries to log in!`);
 * 		setTimeout(() => setIsLoading(false), 1000);
 * 	};
 *
 * 	return <Form isLoading={isLoading} onSubmit={handleSubmit} />;
 * }
 * ```
 */
export function Form({
	isLoading,
	onSubmit,
	initialServerURL = '',
	initialUsername = ''
}: FormProps) {
	const [serverUrl, setServerUrl] = useState<string | null>('');
	const [username, setUsername] = useState<string | null>('');
	const [password, setPassword] = useState<string | null>('');

	const login = useCallback(() => {
		if (serverUrl && username && password) {
			onSubmit({ serverUrl, username, password });
		}
	}, [onSubmit, password, serverUrl, username]);

	const [focused, setFocused] = useState(() => {
		if (initialUsername) return 2;
		if (initialServerURL) return 1;
		return 0;
	});

	return (
		<>
			<RSForm maxWidth="100%" isRequired isDisabled={isLoading}>
				<TextField
					autoFocus={focused === 0}
					onNext={() => setFocused(1)}
					label="Backend Server"
					placeholder="Server URL"
					initialValue={initialServerURL}
					onChange={setServerUrl}
					validator={isValidHttpUrl}
				/>
				<TextField
					autoFocus={focused === 1}
					onNext={() => setFocused(2)}
					label="Username"
					placeholder="Your username"
					initialValue={initialUsername}
					onChange={setUsername}
					validator={isValidText}
				/>
				<TextField
					autoFocus={focused === 2}
					onNext={login}
					label="Password"
					placeholder="Your password"
					type="password"
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
