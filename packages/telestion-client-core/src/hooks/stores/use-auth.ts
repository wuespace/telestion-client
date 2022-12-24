import create, { UseBoundStore } from 'zustand';
import {
	Auth,
	SignInResult,
	SignOutResult
} from '@wuespace/telestion-client-types';

import { FakeAuth } from '../../lib/auth';
import { getLogger } from '../../lib';
import { AuthState } from './use-auth.model';

const logger = getLogger('Auth State');

// one project wide authenticator
// TODO: configurable authenticator via TelestionClient component
const authenticator: Auth = new FakeAuth();

// stores the cleanup for registered callback on authenticator
let cleanupCb: (() => void) | null = null;

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
 * @see {@link UseBoundStore}
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
export const useAuth: UseBoundStore<AuthState> = create<AuthState>(
	(set, get) => ({
		auth: null,
		signIn(
			authServerUrl: string,
			username: string,
			password: string
		): Promise<SignInResult> {
			logger.debug(
				`SignIn called - Auth server: ${authServerUrl}, username: ${username}`
			);
			return authenticator
				.signIn(authServerUrl, username, password)
				.then(signInRes => {
					logger.success('Signed in!');
					// clean up callback
					if (cleanupCb) {
						cleanupCb();
						cleanupCb = null;
					}

					cleanupCb = authenticator.onAuthStateChanged(changeRes => {
						if (
							changeRes.type === 'signOut' ||
							changeRes.user !== get().auth?.username
						) {
							logger.warn('Signed out externally');
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
			logger.debug('SignOut called');
			// clean up callback
			if (cleanupCb) {
				cleanupCb();
				cleanupCb = null;
			}

			return authenticator.signOut().then(signOutRes => {
				logger.success('Signed out!');
				set({ auth: null });
				if (signOutRes.reason) {
					logger.warn('User signed out because:', signOutRes.reason);
				}
				return signOutRes;
			});
		}
	})
);
