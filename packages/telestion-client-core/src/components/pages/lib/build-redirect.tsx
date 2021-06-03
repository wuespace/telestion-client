import { Redirect, Route } from 'react-router-dom';
import { AbstractRedirect } from '@wuespace/telestion-client-types';
import { logger } from './logger';

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
export function buildRedirect(redirect: AbstractRedirect) {
	const key = `red:${redirect.path}:${redirect.redirectPath}`;

	logger.debug(
		`Route with${redirect.exact ? ' exact' : ''} path "${
			redirect.path
		}" should redirect to "${redirect.redirectPath}"`
	);

	return (
		<Route key={key} path={redirect.path} exact={redirect.exact}>
			<Redirect to={redirect.redirectPath} />
		</Route>
	);
}
