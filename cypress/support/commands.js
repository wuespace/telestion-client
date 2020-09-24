// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('login', (username, password, serverUrl) => {
	// fill in login form
	cy.get('form').within(() => {
		// rely on default server url if none is given
		if (serverUrl) cy.get('input[name="backend-server"]').type(serverUrl);
		cy.get('input[name="username"]').type(username);
		cy.get('input[name="password"]').type(password);
	});

	// search for login button and click it
	cy.contains('Login').click();
});

Cypress.Commands.add('logout', () => {
	// search for logout button and click it
	cy.contains('Logout').click();
});
