import { Auth, AuthResult, SignInResult, SignOutResult } from './auth';

export class FakeAuth implements Auth {
	private isAuthenticated = false;

	private serverUrl: string;

	private username: string;

	signIn(
		serverUrl: string,
		username: string,
		password: string
	): Promise<SignInResult> {
		return new Promise((resolve, reject) => {
			if (username !== 'thebox') {
				reject(new Error('The Box is not here. Please look somewhere else'));
			}

			if (this.isAuthenticated) {
				if (serverUrl !== this.serverUrl || username !== this.username) {
					reject(new Error('Already signed in with other credentials'));
				}

				resolve({
					type: 'signIn',
					user: this.username,
					reason: 'Already signed in with given credentials'
				});
			}

			if (serverUrl && username && password) {
				this.isAuthenticated = true;
				this.serverUrl = serverUrl;
				this.username = username;
				// fake sign in delay
				// TODO: Remove in production
				setTimeout(() => resolve({ type: 'signIn', user: username }), 500);
			}
		});
	}

	signOut(): Promise<SignOutResult> {
		return new Promise(resolve => {
			if (!this.isAuthenticated) {
				resolve({ type: 'signOut', reason: 'Already signed out' });
			}

			this.isAuthenticated = false;
			this.serverUrl = '';
			this.username = '';
			// fake sign out delay
			// TODO: Remove in production
			setTimeout(() => resolve({ type: 'signOut' }), 100);
		});
	}

	onAuthStateChanged(cb: (res: AuthResult) => void): () => void {
		return () => {};
	}
}
