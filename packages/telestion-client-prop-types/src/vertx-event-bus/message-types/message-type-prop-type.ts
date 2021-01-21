import PropTypes from 'prop-types';

/**
 * PropType for an event bus message type
 *
 * See {@link @wuespace/vertx-event-bus#BaseMessage."type"}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#BaseMessage."type"}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const messageTypePropType = PropTypes.oneOf([
	'ping',
	'register',
	'unregister',
	'publish',
	'send',
	'rec',
	'err'
]);
