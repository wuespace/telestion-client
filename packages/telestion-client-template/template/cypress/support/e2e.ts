// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// https://github.com/quasarframework/quasar/issues/2233
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;

Cypress.on('uncaught:exception', err => {
	/* returning false here prevents Cypress from failing the test */
	if (resizeObserverLoopErrRe.test(err.message)) {
		return false;
	}
});

Cypress.on('log:added', (attrs, log) => {
	if (attrs.displayName === 'xhr' && attrs.url.includes('localhost:9870')) {
		// @ts-expect-error   --  you can modify the types for this if you want.
		const top$ = window.top?.Cypress.$Cypress.$;
		top$('.command').last().hide();
	}
});
