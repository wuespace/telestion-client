import { Children, ReactNode } from 'react';
import PropTypes from 'prop-types';
import {
	HashRouter as Router,
	Switch,
	Route as DefaultRoute,
	Redirect
} from 'react-router-dom';
import { AbstractRedirect } from '@wuespace/telestion-client-types';

import { AuthRoute } from './routes/auth-route';
import { UnAuthRoute } from './routes/un-auth-route';
import { isValidChild, parseRouting } from './pages-utils';

const routeComponents = {
	auth: AuthRoute,
	unAuth: UnAuthRoute,
	default: DefaultRoute
};

const defaultRouting = {
	exact: false,
	redirectPath: '',
	additionalRedirects: []
};

/**
 * Builds a redirect for a given path the application route can take.
 * @param redirect the redirect information
 */
function buildRedirect(redirect: AbstractRedirect) {
	const key = `red:${redirect.path}:${redirect.redirectPath}`;
	return (
		<DefaultRoute key={key} path={redirect.path} exact={redirect.exact}>
			<Redirect to={redirect.redirectPath} />
		</DefaultRoute>
	);
}

export interface PagesProps {
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
 * @example ```ts
 * import { Pages } from '@wuespace/telestion-client-core';
 *
 * const MyPages = () => (
 *   <Pages>
 *     <LoginPage />
 *     <DashboardPage />
 *     <NotFoundPage />
 *   </Pages>
 * );
 */
export const Pages = ({ children }: PagesProps) => {
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
};

Pages.propTypes = {
	children: PropTypes.node
};
