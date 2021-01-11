import PropTypes from 'prop-types';

/**
 * PropType for an abstract routing
 *
 * See {@link @wuespace/telestion-client-types#AbstractRouting}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#AbstractRouting}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const abstractRoutingPropType = PropTypes.shape({
	path: PropTypes.string.isRequired,
	exact: PropTypes.bool
});

/**
 * PropType for an abstract redirect
 *
 * See {@link @wuespace/telestion-client-types#AbstractRedirect}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#AbstractRedirect}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const abstractRedirectPropType = PropTypes.shape({
	path: PropTypes.string.isRequired,
	exact: PropTypes.bool,
	redirectPath: PropTypes.string.isRequired
});

/**
 * PropType for an additional redirect
 *
 * See {@link @wuespace/telestion-client-types#AdditionalRedirect}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#AdditionalRedirect}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const additionalRedirectPropType = PropTypes.shape({
	path: PropTypes.string.isRequired,
	exact: PropTypes.bool,
	redirectPath: PropTypes.string.isRequired,
	last: PropTypes.bool.isRequired
});

/**
 * PropType for an routing type
 *
 * See {@link @wuespace/telestion-client-types#BaseRouting."type"}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#BaseRouting."type"}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const routingTypePropType = PropTypes.oneOf([
	'default',
	'unAuth',
	'auth'
]);

/**
 * PropType for a base routing
 *
 * See {@link @wuespace/telestion-client-types#BaseRouting}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#BaseRouting}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const baseRoutingPropType = PropTypes.shape({
	path: PropTypes.string.isRequired,
	exact: PropTypes.bool,
	type: routingTypePropType.isRequired,
	additionalRedirects: PropTypes.arrayOf(additionalRedirectPropType)
});

/**
 * PropType for a default routing
 *
 * See {@link @wuespace/telestion-client-types#DefaultRouting}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#DefaultRouting}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const defaultRoutingPropType = PropTypes.shape({
	path: PropTypes.string.isRequired,
	exact: PropTypes.bool,
	type: PropTypes.oneOf(['default']),
	additionalRedirects: PropTypes.arrayOf(additionalRedirectPropType)
});

/**
 * PropType for a un-authorized routing
 *
 * See {@link @wuespace/telestion-client-types#UnAuthRouting}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#UnAuthRouting}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const unAuthRoutingPropType = PropTypes.shape({
	path: PropTypes.string.isRequired,
	exact: PropTypes.bool,
	redirectPath: PropTypes.string.isRequired,
	type: PropTypes.oneOf(['unAuth']),
	additionalRedirects: PropTypes.arrayOf(additionalRedirectPropType)
});

/**
 * PropType for an authorized routing
 *
 * See {@link @wuespace/telestion-client-types#AuthRouting}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#AuthRouting}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const authRoutingPropType = PropTypes.shape({
	path: PropTypes.string.isRequired,
	exact: PropTypes.bool,
	redirectPath: PropTypes.string.isRequired,
	type: PropTypes.oneOf(['auth']),
	additionalRedirects: PropTypes.arrayOf(additionalRedirectPropType)
});

/**
 * PropType for any routing
 *
 * See {@link @wuespace/telestion-client-types#Routing}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#Routing}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const routingPropType = PropTypes.oneOfType([
	defaultRoutingPropType,
	unAuthRoutingPropType,
	authRoutingPropType
]);
