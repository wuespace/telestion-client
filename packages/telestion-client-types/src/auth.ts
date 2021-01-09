/**
 * a basic result from an authenticator function
 *
 * only useful as a base type for more specified results
 */
interface BaseResult {
	/**
	 * the type of the auth result
	 */
	type: string;

	/**
	 * optional reason why the authentication state has changed
	 */
	reason?: string;
}

/**
 * Result of a sign in process
 * commonly returned from a sign in function of an authenticator.
 *
 * @see {@link Auth}
 * @see {@link BaseResult}
 *
 * @example
 * Analyze sign in result
 * ```ts
 * const authenticator: Auth = new SomeAuth(); // implements Auth
 *
 * authenticator.signIn('http://localhost:9870/bridge/', 'alice', '12345')
 * 	.then(signInRes => {
 * 		console.log(`User ${signInRes} signed in`);
 * 		if (signInRes.reason) {
 * 			console.log(`Because ${signInRes.reason}`);
 * 		}
 * 	}
 * ```
 */
export interface SignInResult extends BaseResult {
	type: 'signIn';
	/**
	 * the name of the user who is authenticated
	 *
	 * @see {@link Auth.signIn}
	 */
	user: string;
}

/**
 * Result of a sign out process
 * commonly returned from a sign out function of an authenticator.
 *
 * @see {@link Auth}
 * @see {@link BaseResult}
 *
 * @example
 * Analyze sign in result
 * ```ts
 * const authenticator: Auth = new SomeAuth(); // implements Auth
 *
 * // maybe some sign in before
 *
 * authenticator.signOut()
 * 	.then(signOutRes => {
 *		console.log(`Signed out`);
 *		if (signOutRes.reason) {
 * 			console.log(`Because ${signOutRes.reason}`);
 *		}
 * 	}
 * ```
 */
export interface SignOutResult extends BaseResult {
	type: 'signOut';
}

/**
 * an authentication result
 * commonly returned from an authenticator sign in or sign out function.
 *
 * It can be a sign in result or a sign out result
 * based on the current authentication state.
 *
 * @see {@link Auth}
 * @see {@link SignInResult}
 * @see {@link SignOutResult}
 */
export type AuthResult = SignInResult | SignOutResult;

/**
 * A definition for an authenticator.
 *
 * It may be used in the {@link useAuth} hook to authenticate users
 * via given credentials.
 *
 * @see {@link Auth.signIn}
 * @see {@link Auth.signOut}
 *
 * @example
 * Very simple login process
 * ```ts
 * const authenticator: Auth = new SomeAuth(); // implements Auth
 *
 * export function signIn(
 * 	serverUrl: string,
 * 	username: string,
 * 	password: string
 * ): Promise<string> {
 * 	return authenticator
 * 		.signIn(serverUrl, username, password)
 * 		.then(signInRes => {
 * 			set({ user: signInRes.user, serverUrl });
 * 			return signInRes.user;
 * 		});
 * };
 * ```
 */
export interface Auth {
	/**
	 * Tries to sign in to the server with the specified url
	 * using the given user credentials
	 * and resolves if the authentication was successful
	 * and otherwise rejects if the authentication was not successful.
	 *
	 * @param serverUrl - the server to authenticate to
	 * @param username - the users name
	 * @param password - the users password
	 *
	 * @see {@link SignInResult}
	 * @see {@link Auth.signOut}
	 *
	 * @example
	 * Very simple login process
	 * ```ts
	 * const authenticator: Auth = new SomeAuth(); // implements Auth
	 *
	 * export function signIn(
	 * 	serverUrl: string,
	 * 	username: string,
	 * 	password: string
	 * ): Promise<string> {
	 * 	return authenticator
	 * 		.signIn(serverUrl, username, password)
	 * 		.then(signInRes => {
	 * 			set({ user: signInRes.user, serverUrl });
	 * 			return signInRes.user;
	 * 		});
	 * };
	 * ```
	 */
	signIn(
		serverUrl: string,
		username: string,
		password: string
	): Promise<SignInResult>;

	/**
	 * Tries to sign out from the server and close all connections.
	 *
	 * @see {@link SignOutResult}
	 * @see {@link Auth.signIn}
	 *
	 * @example
	 * A very simple logout process
	 * ```ts
	 * const authenticator: Auth = new SomeAuth(); // implements Auth
	 *
	 * export function signOut(): Promise<void> {
	 * 	return authenticator.signOut().then(res => {
	 * 		set({ user: null, serverUrl: null });
	 * 		if (res.reason) {
	 * 			logger.warn('User signed out because:', res.reason);
	 * 		}
	 * 	});
	 * }
	 * ```
	 */
	signOut(): Promise<SignOutResult>;

	/**
	 * Registers an event handler that gets called
	 * if an external auth state change happens.
	 * @param cb - the handler that will be called
	 *
	 * @see {@link AuthResult}
	 * @see {@link Auth.signIn}
	 * @see {@link Auth.signOut}
	 *
	 * @example
	 * Registers on login and clean up on logout
	 * ```ts
	 * const authenticator: Auth = new SomeAuth(); // implements Auth
	 *
	 * // stores the cleanup for registered callback on authenticator
	 * let cleanupCb: (() => void) | null = null;
	 *
	 * export function signIn(
	 * 	serverUrl: string,
	 * 	username: string,
	 * 	password: string
	 * ): Promise<string> {
	 * 	// clean up callback
	 * 	if (cleanupCb) {
	 * 		cleanupCb();
	 * 		cleanupCb = null;
	 * 	}
	 *
	 * 	return authenticator
	 * 		.signIn(serverUrl, username, password)
	 * 		.then(signInRes => {
	 * 			cleanupCb = authenticator.onAuthStateChanged(changeRes => {
	 * 				if (changeRes.type === 'signOut' || changeRes.user !== get().user) {
	 * 					set({ user: null, serverUrl: null });
	 * 				}
	 * 			});
	 * 			set({ user: signInRes.user, serverUrl });
	 * 			return signInRes.user;
	 * 		});
	 * };
	 *
	 * export function signOut(): Promise<void> {
	 * 	// clean up callback
	 * 	if (cleanupCb) {
	 * 		cleanupCb();
	 * 		cleanupCb = null;
	 * 	}
	 *
	 * 	return authenticator.signOut().then(res => {
	 * 		set({ user: null, serverUrl: null });
	 * 	});
	 * }
	 * ```
	 */
	onAuthStateChanged(cb: (res: AuthResult) => void): () => void;
}
