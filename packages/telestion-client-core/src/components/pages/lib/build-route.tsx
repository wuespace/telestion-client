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
	routing: Routing & { redirectPath: string },
	page: ReactNode,
	isAuthenticated: boolean
): ReactNode {
	const key = `comp:${routing.path}:${routing.redirectPath}`;
	const shouldRender =
		(routing.type === 'auth' && isAuthenticated) ||
		(routing.type === 'unAuth' && !isAuthenticated);

	logger.debug(
		`Route with${routing.exact ? ' exact' : ''} path "${routing.path}" should ${
			shouldRender ? 'render' : `redirect to "${routing.redirectPath}"`
		}`
	);

	return (
		<Route key={key} path={routing.path} exact={routing.exact}>
			{shouldRender ? page : <Redirect to={routing.redirectPath} />}
		</Route>
	);
}
