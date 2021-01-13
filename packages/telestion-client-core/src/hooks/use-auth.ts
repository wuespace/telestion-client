import create, { UseStore } from 'zustand';
import {
	Auth,
	SignInResult,
	SignOutResult
} from '@wuespace/telestion-client-types';

import { FakeAuth } from '../lib/auth';
import { getLogger } from '../lib/logger';

const logger = getLogger('Auth State');

// one project wide authenticator
// TODO: configurable authenticator via TelestionClient component
const authenticator: Auth = new FakeAuth();

// stores the cleanup for registered callback on authenticator
let cleanupCb: (() => void) | null = null;

/**
 * Current authentication data stored here.
 */
export interface Authentication {
	/**
	 * the user's name who's is authenticated
	 *
	 * @see {@link AuthState.signIn}
	 */
	username: string;

	/**
	 * the URL of the authentication server
	 *
	 * @see {@link AuthState.signIn}
	 */
	authServerUrl: string;

	/**
	 * the URL of the eventbus (returned from the authenticator)
	 */
	eventBusUrl: string;
}

/**
 * The authentication state and actions of the Telestion Client Core.
 *
 * Defines the authentication state and functions to change the state.
 *
 * @see {@link AuthState.user}
 * @see {@link AuthState.signIn}
 * @see {@link AuthState.signOut}
 */
export interface AuthState extends Record<string, unknown> {
	/**
	 * Stores the current authentication state of the application.
	 * Contains the username, the authentication and the event bus URL.
	 *
	 * If it is `null` nobody is signed in.
	 *
	 * To sign in, call {@link AuthState.signIn}.
	 * To sign out, call {@link AuthState.signOut}.
	 *
	 * @see {@link AuthState.signIn}
	 * @see {@link AuthState.signOut}
	 *
	 * @example
	 * check authentication status
	 * ```ts
	 * export function AuthChecker(): ReactNode {
	 * 	const auth = useAuth(state => state.auth);
	 *
	 * 	return auth ? (
	 * 		<div>
	 * 			<p>User: {auth.username}</p>
	 * 			<p>Auth URL: {auth.authServerUrl}</p>
	 * 			<p>Event bus URL: {auth.eventBusUrl}</p>
	 * 		</div>
	 * 	) : <div>Not authenticated</div>;
	 * }
	 * ```
	 */
	auth: Authentication | null;

	/**
	 * Tries to sign on an authentication server using the specified URL
	 * with given user credentials
	 * and resolves if the authentication was successful
	 * otherwise it rejects if the authentication was not successful.
	 *
	 * To log out, call {@link AuthState.signOut}.
	 *
	 * @param authServerUrl - the server to authenticate to
	 * @param username - the users name
	 * @param password - the users password
	 *
	 * @see {@link AuthState.signOut}
	 * @see {@link AuthState.auth}
	 *
	 * @example
	 * simple sign in process
	 * ```ts
	 * import shallow from 'zustand/shallow';
	 *
	 * // function component context
	 * const { user, signIn } = useAuth(state => ({
	 * 	user: state.user,
	 * 	signIn: state.signIn
	 * }), shallow);
	 *
	 * const signIn = () => {
	 * 	if (!user) {
	 * 		signIn('http://localhost:9870/bridge', 'alice', '12345')
	 * 			.then(signInRes => {
	 * 				console.log(`User ${signInRes.user} signed in`);
	 * 			})
	 * 			.catch(err => {
	 * 				console.log(`Cannot log in because: ${err.message}`);
	 * 			});
	 * 	}
	 * };
	 * ```
	 */
	signIn(
		authServerUrl: string,
		username: string,
		password: string
	): Promise<SignInResult>;

	/**
	 * Tries to sign out from the logged in authentication server
	 * and close all connections.
	 *
	 * To log in again, call {@link AuthState.signIn}.
	 *
	 * @see {@link AuthState.signIn}
	 * @see {@link AuthState.auth}
	 *
	 * @example
	 * simple sign out process
	 * ```ts
	 * import shallow from 'zustand/shallow';
	 *
	 * // function component context
	 * const { user, signOut } = useAuth(state => ({
	 * 	user: state.user,
	 * 	signOut: state.signOut
	 * }), shallow);
	 *
	 * const signOut = () => {
	 * 	if (user) {
	 * 		signOut()
	 * 			.then(()) => {
	 * 				console.log(`Logged out`);
	 * 			})
	 * 			.catch(err => {
	 * 				console.log(`Cannot log out because: ${err.message}`);
	 * 			});
	 * 	}
	 * };
	 * ```
	 */
	signOut(): Promise<SignOutResult>;
}

/**
 * Returns the authentication state and actions to interact with.
 * A selector can be defined to pick out parts of the store.
 * If correctly set up, the function only triggers a rerender
 * if the selected values have changed.
 *
 * For more information about state management in Zustand,
 * take a look at their {@link https://github.com/pmndrs/zustand | GitHub page}.
 *
 * @param selector - optional selector function
 * which picks the specified elements out of the store
 * @param equalityFn - optional equality function
 * to check for state updates on the picked elements
 * @returns the picked elements in the selector function
 *
 * @see {@link AuthState}
 * @see {@link https://github.com/pmndrs/zustand}
 * @see {@link UseStore}
 * @see {@link zustand#shallow}
 *
 * @example
 * Fetch current authentication state from the store:
 * ```ts
 * // React component or hook context
 * const auth = useAuth(state => state.auth);
 *
 * if (auth) {
 * 	console.log(`User ${auth.username} is logged in`);
 * } else {
 * 	console.log('Nobody is logged in');
 * }
 * ```
 *
 * Performance optimized and type-safe fetching from the store:
 * ```ts
 * import { useCallback, ReactNode } from 'react';
 * import { StateSelector } from 'zustand';
 * import shallow from 'zustand/shallow';
 * import { useAuth, AuthState } from '@wuespace/telestion-client-core';
 *
 * // selector does not depend on scope, so it's better to define it outside
 * // to not re-declare it on every render
 * const selector: StateSelector<
 * 	AuthState,
 * 	{
 * 		signIn: AuthState['signIn'],
 * 		signOut: AuthState['signOut']
 * 	}
 * > = state => ({
 * 	signIn: state.signIn,
 * 	signOut: state.signOut
 * });
 *
 * export function MyComponent(): ReactNode {
 * 	const { signIn, signOut } = useAuth(selector, shallow);
 *
 * 	const logIn = useCallback(
 * 		() => signIn('http://localhost:9870/bridge/', 'alice', '12345'),
 * 		[]
 * 	);
 *
 * 	const logOut = useCallback(() => signOut(), []);
 *
 * 	return (
 * 		<div>
 * 			<button onClick={logIn}>Login</button>
 * 			<button onClick={logOut}>Logout</button>
 * 		</div>
 * 	);
 * }
 * ```
 */
export const useAuth: UseStore<AuthState> = create<AuthState>((set, get) => ({
	auth: null,
	signIn(
		authServerUrl: string,
		username: string,
		password: string
	): Promise<SignInResult> {
		return authenticator
			.signIn(authServerUrl, username, password)
			.then(signInRes => {
				// clean up callback
				if (cleanupCb) {
					cleanupCb();
					cleanupCb = null;
				}

				cleanupCb = authenticator.onAuthStateChanged(changeRes => {
					if (changeRes.type === 'signOut' || changeRes.user !== get().user) {
						set({ auth: null });
					}
				});
				set({
					auth: {
						username: signInRes.user,
						authServerUrl,
						eventBusUrl: signInRes.eventBusUrl
					}
				});
				return signInRes;
			});
	},
	signOut(): Promise<SignOutResult> {
		// clean up callback
		if (cleanupCb) {
			cleanupCb();
			cleanupCb = null;
		}

		return authenticator.signOut().then(signOutRes => {
			set({ auth: null });
			if (signOutRes.reason) {
				logger.warn('User signed out because:', signOutRes.reason);
			}
			return signOutRes;
		});
	}
}));
