import { Children, FC, ReactElement } from 'react';
import {
	HashRouter as Router,
	Switch,
	Route as DefaultRoute,
	Redirect
} from 'react-router-dom';

import {
	PageFunctionalComponent,
	Routing
} from '../../types/page-functional-component';
import { AuthRoute } from './routes/auth-route';
import { UnAuthRoute } from './routes/un-auth-route';

function buildRedirect(redirect) {
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

type Child = ReactElement<any, PageFunctionalComponent<any>>;

export interface PagesProps {
	children: Child | Array<Child>;
}

export const Pages: FC<PagesProps> = ({ children }) => {
	const routes = [];
	const lastRoutes = [];

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
