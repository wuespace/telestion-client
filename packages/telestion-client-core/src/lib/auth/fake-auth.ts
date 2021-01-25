import {
	Auth,
	AuthResult,
	SignInResult,
	SignOutResult
} from '@wuespace/telestion-client-types';

/**
 * Fake authenticator that accepts every username with every password
 * and therefore always resolves.
 */
export class FakeAuth implements Auth {
	private isAuthenticated = false;

	private eventBusUrl: string;

	private username: string;

	constructor() {
		this.eventBusUrl = '';
		this.username = '';
	}

	signIn(
		serverUrl: string,
		username: string,
		password: string
	): Promise<SignInResult> {
		return new Promise((resolve, reject) => {
			if (username === 'thebox') {
				reject(new Error('The Box is not here. Please look somewhere else'));
				return;
			}

			if (this.isAuthenticated) {
				if (serverUrl !== this.eventBusUrl || username !== this.username) {
					reject(new Error('Already signed in with other credentials'));
					return;
				}

				resolve({
					type: 'signIn',
					user: this.username,
					eventBusUrl: this.eventBusUrl,
					reason: 'Already signed in with given credentials'
				});
				return;
			}

			if (serverUrl && username && password) {
				this.isAuthenticated = true;
				// TODO: change in production
				this.eventBusUrl = serverUrl;
				this.username = username;
				// fake sign in delay
				// TODO: Remove in production
				setTimeout(
					() =>
						resolve({
							type: 'signIn',
							user: username,
							eventBusUrl: this.eventBusUrl
						}),
					1500
				);
			}
		});
	}

	signOut(): Promise<SignOutResult> {
		return new Promise(resolve => {
			if (!this.isAuthenticated) {
				resolve({ type: 'signOut', reason: 'Already signed out' });
				return;
			}

			this.isAuthenticated = false;
			this.eventBusUrl = '';
			this.username = '';
			// fake sign out delay
			// TODO: Remove in production
			setTimeout(() => resolve({ type: 'signOut' }), 1000);
		});
	}

	// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
	onAuthStateChanged(cb: (res: AuthResult) => void): () => void {
		if (this.username !== '') {
			// cb({ type: 'signIn', user: this.username });
		} else {
			// cb({ type: 'signOut' });
		}

		return () => {};
	}
}
