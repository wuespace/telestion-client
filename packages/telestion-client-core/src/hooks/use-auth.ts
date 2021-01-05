import create from 'zustand';
import { Auth, FakeAuth } from '../lib/auth';
import { getLogger } from '../lib/logger';

const logger = getLogger('Auth State');

// one project wide authenticator
// TODO: configurable authenticator via TelestionClient component
const authenticator: Auth = new FakeAuth();

// stores the cleanup for registered callback on authenticator
let cleanupCb: (() => void) | null = null;

export type AuthState = {
	/**
	 * the current user name who is logged in
	 * otherwise `null` if the user is not logged in
	 */
	user: string | null;

	/**
	 * the server url the user authenticated to
	 * otherwise `null` if the user ist not logged in
	 */
	serverUrl: string | null;

	/**
	 * Tries to sign in to server with the specified url
	 * with given user credentials
	 * and resolves if the authentication was successful
	 * otherwise it rejects if the authentication was not successful.
	 * @param serverUrl the server to authenticate to
	 * @param username the users name
	 * @param password the users password
	 */
	signIn(
		serverUrl: string,
		username: string,
		password: string
	): Promise<string>;

	/**
	 * Tries to sign out from the server and close all connections.
	 */
	signOut(): Promise<void>;
};

export const useAuth = create<AuthState>((set, get) => ({
	user: null,
	serverUrl: null,
	signIn(
		serverUrl: string,
		username: string,
		password: string
	): Promise<string> {
		// clean up callback
		if (cleanupCb) {
			cleanupCb();
			cleanupCb = null;
		}

		return authenticator
			.signIn(serverUrl, username, password)
			.then(signInRes => {
				cleanupCb = authenticator.onAuthStateChanged(changeRes => {
					if (changeRes.type === 'signOut' || changeRes.user !== get().user) {
						set({ user: null, serverUrl: null });
					}
				});
				set({ user: signInRes.user, serverUrl });
				return signInRes.user;
			});
	},
	signOut(): Promise<void> {
		// clean up callback
		if (cleanupCb) {
			cleanupCb();
			cleanupCb = null;
		}

		return authenticator.signOut().then(res => {
			set({ user: null, serverUrl: null });
			if (res.reason) {
				logger.warn('User signed out because:', res.reason);
			}
		});
	}
}));
