import { useCallback, useState } from 'react';
import { StateSelector } from 'zustand';
import { Flex, Heading, Image, Text, Well } from '@adobe/react-spectrum';
import { AuthState, useAuth, useTitle } from '@wuespace/telestion-client-core';

import { LoginForm, Submission } from './login-form/login-form';
import { useLogo } from '../../contexts/app-logo-context';

// auth selector
const selector: StateSelector<AuthState, AuthState['signIn']> = ({ signIn }) =>
	signIn;

export function Login() {
	const title = useTitle();
	const appLogo = useLogo();
	const signIn = useAuth(selector);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const handleSubmit = useCallback(
		({ serverUrl, username, password }: Submission) => {
			setIsLoading(true);
			setError(null);
			signIn(serverUrl, username, password)
				.finally(() => setIsLoading(false))
				.catch(err => setError(err));
		},
		[signIn]
	);

	return (
		<Flex direction="column" maxWidth="size-4600">
			<Image
				src={appLogo}
				alignSelf="center"
				alt="Application logo"
				width="size-1200"
				height="size-1200"
			/>
			<Heading level={2}>{title}</Heading>
			<Text>
				Please enter the credentials assigned to you by the Ground Station team
			</Text>
			{error ? <Well>{error.message}</Well> : <></>}
			<LoginForm isLoading={isLoading} onSubmit={handleSubmit} />
		</Flex>
	);
}
