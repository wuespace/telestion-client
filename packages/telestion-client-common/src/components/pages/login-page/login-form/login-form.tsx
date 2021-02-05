import { useState, useCallback } from 'react';
import { StateSelector } from 'zustand';
import { Well } from '@adobe/react-spectrum';
import { AuthState, useAuth } from '@wuespace/telestion-client-core';

import { Form, Submission } from './form';

// auth selector
const selector: StateSelector<AuthState, AuthState['signIn']> = ({ signIn }) =>
	signIn;

/**
 * React Props of {@link LoginForm}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link LoginForm}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface LoginFormProps {
	/**
	 * The initial value of the server url text field
	 * in the {@link LoginForm} component.
	 */
	initialServerURL?: string;

	/**
	 * The initial value of the username text file
	 * in the {@link LoginForm} component.
	 */
	initialUsername?: string;
}

/**
 * The form component that renders the react-spectrum login form
 * where the user enters his information and credentials to log in with.
 *
 * This component belongs to the {@link LoginPage}
 *
 * @see {@link FormProps}
 * @see {@link LoginPage}
 *
 * @example
 * ```ts
 * function MyLoginPage() {
 * 	return (
 * 		<LoginPage>
				<LoginTitle />
				<LoginLogo />
				<LoginDescription />
				<LoginForm initialServerURL="http://localhost:9870/bridge" />
			</LoginPage>
 * 	);
 * }
 * ```
 */
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
