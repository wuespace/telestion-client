interface BaseResult {
	/**
	 * the type of the auth result
	 */
	type: string;

	/**
	 * optional reason for additional information on auth state changes
	 */
	reason?: string;
}

export interface SignInResult extends BaseResult {
	type: 'signIn';
	/**
	 * the name of the user who is authenticated
	 */
	user: string;
}

export interface SignOutResult extends BaseResult {
	type: 'signOut';
}

export type AuthResult = SignInResult | SignOutResult;

export interface Auth {
	/**
	 * Tries to sign in to server with the specified url
	 * with given user credentials
	 * and resolves if the authentication was successful
	 * otherwise it rejects if the authentication was not successful.
	 * @param serverUrl the server to authenticate to
	 * @param username the users name
	 * @param password the users password
	 */
	signIn(serverUrl: string, username: string, password: string): Promise<SignInResult>;

	/**
	 * Tries to sign out from the server and close all connections.
	 */
	signOut(): Promise<SignOutResult>;

	/**
	 * Registers an event handler that gets called
	 * if an external auth state change happens.
	 * @param cb the handler that will be called
	 */
	onAuthStateChanged(cb: (res: AuthResult) => void): () => void;
}
