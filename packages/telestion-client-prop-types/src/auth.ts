import PropTypes from 'prop-types';

/**
 * PropType for an auth result type
 *
 * See {@link @wuespace/telestion-client-types#SignInResult."type"}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#SignInResult."type"}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const authResultTypePropType = PropTypes.oneOf(['signIn', 'signOut']);

const baseResult = {
	type: authResultTypePropType.isRequired,
	reason: PropTypes.string
};

/**
 * PropType for a sign in result
 *
 * See {@link @wuespace/telestion-client-types#SignInResult}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#SignInResult}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const signInResultPropType = PropTypes.shape({
	...baseResult,
	type: PropTypes.oneOf(['signIn']).isRequired,
	user: PropTypes.string.isRequired,
	eventBusUrl: PropTypes.string.isRequired
});

/**
 * PropType for a sign out result
 *
 * See {@link @wuespace/telestion-client-types#SignOutResult}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#SignOutResult}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const signOutResultPropType = PropTypes.shape({
	...baseResult,
	type: PropTypes.oneOf(['signOut']).isRequired
});

/**
 * PropType for any auth result
 *
 * See {@link @wuespace/telestion-client-types#AuthResult}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#AuthResult}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const authResultPropType = PropTypes.oneOfType([
	signInResultPropType,
	signOutResultPropType
]);

/**
 * PropType for an authenticator definition
 *
 * See {@link @wuespace/telestion-client-types#Auth}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#Auth}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const authPropType = PropTypes.shape({
	signIn: PropTypes.func.isRequired,
	signOut: PropTypes.func.isRequired,
	onAuthStateChanged: PropTypes.func.isRequired
});
