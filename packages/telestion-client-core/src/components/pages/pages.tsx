import { Children, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { StateSelector } from 'zustand';
import { HashRouter as Router, Switch } from 'react-router-dom';

import { AuthState, useAuth } from '../../hooks';
import { buildRedirect, buildRoute, isValidChild, parseRouting } from './lib';

// the default state of a routing object on a page component
// will be merged with the existing part
const defaultRouting = {
	exact: false,
	redirectPath: '',
	additionalRedirects: []
};

const selector: StateSelector<AuthState, boolean> = state => !!state.auth;

/**
 * React Props of {@link Pages}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link Pages}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface PagesProps {
	/**
	 * React nodes that are always rendered above the active page.
	 * E.g. useful for an application header.
	 */
	preNodes?: ReactNode;

	/**
	 * React nodes that are always rendered below the active page.
	 * E.g. useful for an application footer.
	 */
	postNodes?: ReactNode;

	/**
	 * Pages that the application can have.
	 * The {@link Pages} component renders them based on the application state.
	 *
	 * @see {@link https://reactjs.org/docs/glossary.html#propschildren}
	 */
	children: ReactNode;
}

/**
 * The router of the application.
 * Here are all pages managed.
 *
 * Every page defines a `routing` object
 * that is attached to the actual component.
 *
 * If you want to write some pages, please take a look at
 * {@link @wuespace/telestion-client-types#Routing} for more information.
 *
 * @see {@link PagesProps}
 *
 * @example
 * ```ts
 * function MyPages() {
 * 	return (
 * 		<Pages>
 * 			<LoginPage />
 * 			<DashboardPage />
 * 			<NotFoundPage />
 * 		</Pages>
 * 	);
 * }
 * ```
 */
export function Pages({ preNodes, postNodes, children }: PagesProps) {
	const isAuthenticated = useAuth(selector);

	const routes: ReactNode[] = [];
	const lastRoutes: ReactNode[] = [];

	Children.forEach(children, (child, index) => {
		if (isValidChild(child)) {
			// build valid routing object
			const routing = {
				...defaultRouting,
				...parseRouting(child.type.name, child.type.routing)
			};

			// add required routes
			routes.push(buildRoute(routing, child, isAuthenticated));
			routing.additionalRedirects.forEach(redirect =>
				redirect.last
					? lastRoutes.push(buildRedirect(redirect))
					: routes.push(buildRedirect(redirect))
			);
		} else {
			throw new TypeError(
				`Child No. ${index} is not a valid Page component in Pages renderer.` +
					'Please define a valid React Component and attach a routing object to the component.'
			);
		}
	});

	return (
		<Router>
			{preNodes}
			<Switch>
				{routes}
				{lastRoutes}
			</Switch>
			{postNodes}
		</Router>
	);
}

Pages.propTypes = {
	children: PropTypes.node
};
