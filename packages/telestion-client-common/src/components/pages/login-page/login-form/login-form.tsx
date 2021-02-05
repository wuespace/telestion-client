import { useState, useCallback } from 'react';
import { StateSelector } from 'zustand';
import { Well } from '@adobe/react-spectrum';
import { AuthState, useAuth } from '@wuespace/telestion-client-core';

import { Form, Submission } from './form';

// auth selector
const selector: StateSelector<AuthState, AuthState['signIn']> = ({ signIn }) =>
	signIn;

export interface LoginFormProps {
	initialServerURL?: string;

	initialUsername?: string;
}

export function LoginForm({
	initialServerURL,
	initialUsername
}: LoginFormProps) {
	const signIn = useAuth(selector);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const handleSubmit = useCallback(
		({ serverUrl, username, password }: Submission) => {
			setIsLoading(true);
			setError(null);

			signIn(serverUrl, username, password).catch(err => {
				setIsLoading(false);
				setError(err);
			});
		},
		[signIn]
	);

	return (
		<>
			{error ? <Well>{error.message}</Well> : <></>}
			<Form
				isLoading={isLoading}
				onSubmit={handleSubmit}
				initialServerURL={initialServerURL}
				initialUsername={initialUsername}
			/>
		</>
	);
}
