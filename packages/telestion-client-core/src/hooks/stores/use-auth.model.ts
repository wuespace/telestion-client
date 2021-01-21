import { State } from 'zustand';
import { SignInResult, SignOutResult } from '@wuespace/telestion-client-types';

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
export interface AuthState extends State {
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
