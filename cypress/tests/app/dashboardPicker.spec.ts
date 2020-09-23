/// <reference path="../../support/index.d.ts" />

describe('The dashboard picker', () => {
	beforeEach('Load and log in', () => {
		// load credentials, load webpage and log in
		cy.fixture('credentials').then(credentials => {
			cy.visit('/');
			cy.login(credentials.username, credentials.password);
		});
	});

	afterEach('Log out', () => {
		cy.logout();
	});

	it('should successfully log in and log out', () => {
		console.log('Hello!');
	});
});
