import { Children, ReactNode } from 'react';
import PropTypes from 'prop-types';
import {
	HashRouter as Router,
	Switch,
	Route as DefaultRoute,
	Redirect
} from 'react-router-dom';
import { AbstractRedirect } from '@wuespace/telestion-client-types';

import { UnAuthRoute, AuthRoute } from './routes';
import { isValidChild, parseRouting } from './lib';

// components used for routing based on authentication state
const routeComponents = {
	auth: AuthRoute,
	unAuth: UnAuthRoute,
	default: DefaultRoute
};

// the default state of a routing object on a page component
// will be merged with the existing part
const defaultRouting = {
	exact: false,
	redirectPath: '',
	additionalRedirects: []
};

/**
 * Builds a redirect for a given path the application route can take.
 * @param redirect -  the redirect information
 * @returns a redirect on a specific route
 *
 * @example
 * ```ts
 * const routes: ReactNode[] = [];
 * routes.push(buildRedirect(redirect));
 *
 * return <div>{routes}</div>;
 * ```
 */
function buildRedirect(redirect: AbstractRedirect) {
	const key = `red:${redirect.path}:${redirect.redirectPath}`;
	return (
		<DefaultRoute key={key} path={redirect.path} exact={redirect.exact}>
			<Redirect to={redirect.redirectPath} />
		</DefaultRoute>
	);
}

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
export function Pages({ children }: PagesProps) {
	const routes: ReactNode[] = [];
	const lastRoutes: ReactNode[] = [];

	Children.forEach(children, (child, index) => {
		if (isValidChild(child)) {
			const routing = {
				...defaultRouting,
				...parseRouting(child.type.name, child.type.routing)
			};
			const Route = routeComponents[routing.type];
			const key = `comp:${routing.path}:${routing.redirectPath}`;

			routes.push(
				<Route
					key={key}
					path={routing.path}
					redirectPath={routing.redirectPath}
					exact={routing.exact}
				>
					{child}
				</Route>
			);

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
			<Switch>
				{routes}
				{lastRoutes}
			</Switch>
		</Router>
	);
}

Pages.propTypes = {
	children: PropTypes.node
};
