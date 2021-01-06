import { FunctionComponent } from 'react';

export interface AbstractRouting {
	/**
	 * The component will be rendered
	 * if the given path matches the current application route.
	 *
	 * @see https://reactrouter.com/web/api/Route
	 */
	path: string;

	/**
	 * When {@code true} the path will only match
	 * if the application route is exactly the same as the path.
	 *
	 * @see https://reactrouter.com/web/api/Route/exact-bool
	 */
	exact?: boolean;
}

export interface AbstractRedirect extends AbstractRouting {
	/**
	 * the path the application will be redirected
	 * if the routing type does not match current application state
	 *
	 * @see https://reactrouter.com/web/api/Redirect
	 */
	redirectPath: string;
}

export interface AdditionalRedirect extends AbstractRedirect {
	/**
	 * If {@code true} the additional redirect will be inserted
	 * after all registered routes in the
	 * {@link "@wuespace/telestion-client-core".Pages} component
	 * otherwise it will be directly attached
	 * after the routing definition of the component.
	 */
	last: boolean;
}

interface BaseRouting extends AbstractRouting {
	/**
	 * the type of redirect for the component to use
	 */
	type: string;

	/**
	 * additional redirects defined by the component
	 * which will always redirect based on the entry
	 *
	 * @see {@link AdditionalRedirect}
	 */
	additionalRedirects: Array<AdditionalRedirect>;
}

/**
 * the default type of routing
 *
 * It not depends on the application state
 * and will always be reachable under the given {@link path}.
 */
export interface DefaultRouting extends BaseRouting {
	type: 'default';
}

/**
 * The component will only be rendered
 * if the user in the application is unauthorized (or logged out)
 * otherwise the app will be redirected to the given {@link redirectPath}
 */
export interface UnAuthRouting extends BaseRouting, AbstractRedirect {
	type: 'unAuth';
}

/**
 * The component will only be rendered
 * if the user in the application is authorized (or logged in)
 * otherwise the app will be redirected to the given {@link redirectPath}
 */
export interface AuthRouting extends BaseRouting, AbstractRedirect {
	type: 'auth';
}

export type Routing = DefaultRouting | UnAuthRouting | AuthRouting;

/**
 * An extended version of the {@link FunctionComponent} from React
 * which includes routing based on the application route and state.
 */
export interface PageFunctionalComponent<P = Record<string, unknown>>
	extends FunctionComponent<P> {
	/**
	 * the routing for the component
	 *
	 * only necessary in the {@link "@wuespace/telestion-client-core".Pages} component
	 */
	routing: Routing;
}

/**
 * Shorthand type for {@link PageFunctionalComponent}
 */
export type PFC<P = Record<string, unknown>> = PageFunctionalComponent<P>;
