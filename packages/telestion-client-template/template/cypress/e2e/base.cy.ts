describe('basic functionality', () => {
	it('logs in', () => {
		cy.visit('http://localhost:8080');
		cy.contains('Username').click().type('admin');
		cy.contains('Password').click().type('admin');
		cy.screenshot();
		cy.contains('Login').click();

		cy.url().should('include', '/#/dashboard/0');
		cy.contains('Disconnected');
		cy.screenshot();
	});
});
