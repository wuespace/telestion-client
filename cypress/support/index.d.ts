// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
	interface Chainable {
		/**
		 * Tries to log in with the given credentials and options into the application.
		 * @param username username to log in with
		 * @param password password associated the username
		 * @param serverUrl custom server url to connect to
		 */
		login(username: string, password: string, serverUrl?: string): void;

		/**
		 * Tries to log out from the current session.
		 */
		logout(): void;
	}
}
