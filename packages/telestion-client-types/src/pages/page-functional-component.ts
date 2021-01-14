/**
 * Defines a generic routing interface for a Page component.
 */
export interface AbstractRouting {
	/**
	 * Describes the path of the Page component.
	 *
	 * The Page will be rendered
	 * if the application path resolves to the specified path.
	 *
	 * @see {@link https://reactrouter.com/web/api/Route}
	 */
	path: string;

	/**
	 * When it is `true` the Path will only match
	 * if the application route is exactly the same as the specified path above.
	 *
	 * @see {@link path}
	 * @see {@link https://reactrouter.com/web/api/Route/exact-bool}
	 */
	exact?: boolean;
}

/**
 * Defines a generic routing interface
 * with an additional redirect specifier for a Page component.
 *
 * @see {@link AbstractRouting}
 */
export interface AbstractRedirect extends AbstractRouting {
	/**
	 * Describes the path the application will be redirected
	 * if the routing type does not match current application state.
	 *
	 * @see {@link UnAuthRouting}
	 * @see {@link AuthRouting}
	 * @see {@link https://reactrouter.com/web/api/Redirect}
	 */
	redirectPath: string;
}

/**
 * Specifies an additional redirect which will add a route to the application
 * when the application path matches the application are redirected
 * to the specified path.
 *
 * @see {@link AbstractRouting}
 * @see {@link AbstractRedirect}
 */
export interface AdditionalRedirect extends AbstractRedirect {
	/**
	 * If it is `true` the additional redirect will be inserted
	 * after all registered routes in the
	 * {@link @wuespace/telestion-client-core#Pages | Pages renderer component}
	 * otherwise it will be directly attached
	 * after the routing definition of the component.
	 *
	 * @see {@link @wuespace/telestion-client-core#Pages}
	 * @see {@link AbstractRedirect}
	 */
	last: boolean;
}

/**
 * Defines a basic routing object for a Page component.
 *
 * @see {@link AbstractRouting}
 */
interface BaseRouting extends AbstractRouting {
	/**
	 * Describes the type of redirect for the Page component to use.
	 *
	 * This can be a {@link DefaultRouting | default routing}
	 * or some application state dependent routing
	 * like {@link UnAuthRouting | unauthorized routing}
	 * or {@link AuthRouting | authorized routing}.
	 *
	 * @see {@link DefaultRouting}
	 * @see {@link UnAuthRouting}
	 * @see {@link AuthRouting}
	 */
	type: 'default' | 'unAuth' | 'auth';

	/**
	 * Defines additional redirects that will be added to the
	 * {@link @wuespace/telestion-client-core#Pages | Pages renderer component}
	 * additionally.
	 *
	 * @see {@link AdditionalRedirect}
	 * @see {@link @wuespace/telestion-client-core#Pages}
	 */
	additionalRedirects?: Array<AdditionalRedirect>;
}

/**
 * Specifies the default type of routing for a Page component.
 *
 * It not depends on the application state
 * and will always be reachable under the given
 * {@link AbstractRouting.path | path}.
 *
 * @see {@link AbstractRouting}
 */
export interface DefaultRouting extends BaseRouting {
	type: 'default';
}

/**
 * Specifies an unauthorized type of routing for a Page component.
 *
 * The Page will only be rendered
 * if the user is unauthorized (or logged out) in the application
 * otherwise the app will be redirected to the given
 * {@link AbstractRedirect.redirectPath}.
 *
 * @see {@link BaseRouting}
 * @see {@link AbstractRedirect}
 */
export interface UnAuthRouting extends BaseRouting, AbstractRedirect {
	type: 'unAuth';
}

/**
 * Specifies an authorized type of routing for a Page component.
 *
 * The Page will only be rendered
 * if the user is authorized (or logged in) in the application
 * otherwise the app will be redirected to the given
 * {@link AbstractRedirect.redirectPath}.
 *
 * @see {@link BaseRouting}
 * @see {@link AbstractRedirect}
 */
export interface AuthRouting extends BaseRouting, AbstractRedirect {
	type: 'auth';
}

/**
 * Defines an object type for routing information of a Page in Telestion Client.
 * It can be based on the application route and state and is important for Pages
 * used in the
 * {@link @wuespace/telestion-client-core#Pages | Pages renderer component}.
 *
 * @see {@link DefaultRouting}
 * @see {@link UnAuthRouting}
 * @see {@link AuthRouting}
 * @see {@link @wuespace/telestion-client-core#Pages}
 */
export type Routing = DefaultRouting | UnAuthRouting | AuthRouting;
