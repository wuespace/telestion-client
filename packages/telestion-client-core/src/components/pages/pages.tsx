import { Children, ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import {
	HashRouter as Router,
	Switch,
	Route as DefaultRoute,
	Redirect
} from 'react-router-dom';

import {
	AbstractRedirect,
	PageFunctionalComponent,
	Routing
} from '../../model/page-functional-component';
import { AuthRoute } from './routes/auth-route';
import { UnAuthRoute } from './routes/un-auth-route';

function buildRedirect(redirect: AbstractRedirect) {
	return (
		<DefaultRoute path={redirect.path} exact={redirect.exact}>
			<Redirect to={redirect.redirectPath} />
		</DefaultRoute>
	);
}

const routeComponents: { [key in Routing['type']]: any } = {
	auth: AuthRoute,
	unAuth: UnAuthRoute,
	default: DefaultRoute
};

const defaultRouting = {
	exact: false,
	redirectPath: '',
	additionalRedirects: []
};

type Child = ReactElement<unknown, PageFunctionalComponent<unknown>>;

export interface PagesProps {
	children: Child | Array<Child>;
}

/**
 * The router of the application.
 *
 * Here are all pages managed.
 */
export const Pages = ({ children }: PagesProps) => {
	const routes: ReactNode[] = [];
	const lastRoutes: ReactNode[] = [];

	Children.forEach(children, (child: Child) => {
		const routing = { ...defaultRouting, ...child.type.routing };
		const Route = routeComponents[routing.type];

		routes.push(
			<Route
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
