import create from 'zustand';
import { Auth, FakeAuth } from '../lib/auth';

// one project wide authenticator
// TODO: configurable authenticator via TelestionClient component
const authenticator: Auth = new FakeAuth();

// stores the cleanup for registered callback on authenticator
let cleanupCb: (() => void) | null = null;

type State = {
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

export const useAuth = create<State>((set, get) => ({
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

		return authenticator.signIn(serverUrl, username, password).then(res => {
			cleanupCb = authenticator.onAuthStateChanged(res => {
				if (res.type === 'signOut' || res.user !== get().user) {
					set({ user: null, serverUrl: null });
				}
			});
			set({ user: res.user, serverUrl: serverUrl });
			return res.user;
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
				console.warn(res.reason);
			}
		});
	}
}));
