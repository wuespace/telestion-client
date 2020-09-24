describe('The Login Page', () => {
	it('should successfully load', () => {
		cy.visit('/');
	});

	it('should successfully log in and logout again', () => {
		cy.fixture('credentials').then(credentials => {
			cy.visit('/');
			cy.login(credentials.username, credentials.password);
			cy.logout();
		});
	});
});
