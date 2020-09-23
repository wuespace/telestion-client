// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add(
	'login',
	(username: string, password: string, serverUrl?: string) => {
		// fill in login form
		cy.get('form').within(() => {
			// rely on default server url if none is given
			if (serverUrl) cy.get('input[name="backend-server"]').type(serverUrl);
			cy.get('input[name="username"]').type(username);
			cy.get('input[name="password"]').type(password);
		});

		// search for login button and click it
		cy.contains('Login').click();
	}
);

Cypress.Commands.add('logout', () => {
	// search for logout button and click it
	cy.contains('Logout').click();
});
