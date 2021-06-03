import { ReactNode } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { Routing } from '@wuespace/telestion-client-types';
import { logger } from './logger';

/**
 * Builds a route for a given routing object of a page.
 * If the current authentication state does not represent
 * the page setting the route redirects.
 *
 * @param routing - the routing object of a page
 * @param page - the page content that should be rendered
 * @param isAuthenticated - `true` when the current user is authenticated
 * @returns a {@link react-router-dom#Route} component
 * containing the routing logic
 *
 * @example
 * ```tsx
 * const routes: ReactNode[] = [];
 *
 * const routing = { ...parseRouting(child.type.name, child.type.routing) };
 * routes.push(buildRoute(routing, child, isAuthenticated));
 * ```
 */
export function buildRoute(
	routing: Routing,
	page: ReactNode,
	isAuthenticated: boolean
): ReactNode {
	const { path, exact, type } = routing;

	const redirectPath = 'redirectPath' in routing ? routing.redirectPath : '';
	const key = `comp:${path}:${redirectPath}`;
	const shouldRender =
		(type === 'auth' && isAuthenticated) ||
		(type === 'unAuth' && !isAuthenticated);

	logger.debug(
		`Route with${exact ? ' exact' : ''} path "${path}" should ${
			shouldRender ? 'render' : `redirect to "${redirectPath}"`
		}`
	);

	return (
		<Route key={key} path={path} exact={exact}>
			{shouldRender ? page : <Redirect to={redirectPath} />}
		</Route>
	);
}
