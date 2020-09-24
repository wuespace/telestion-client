import React from 'react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { mount } from 'cypress-react-unit-test';

import Logo from './Logo';

describe('Logo component', () => {
	it('works', () => {
		mount(
			<Provider theme={defaultTheme}>
				<Logo />
			</Provider>
		);
		cy.get('img')
			.should('be.visible')
			.and(img => {
				expect(img[0].naturalWidth).to.be.greaterThan(0);
			});
	});
});
