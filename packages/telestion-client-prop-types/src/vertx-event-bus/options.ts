import PropTypes from 'prop-types';

/**
 * PropType for an event bus option
 *
 * See {@link @wuespace/vertx-event-bus#Options}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#Options}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const optionsPropType = PropTypes.shape({
	pingInterval: PropTypes.number,
	reconnectAttempts: PropTypes.number,
	reconnectExponent: PropTypes.number,
	delayMin: PropTypes.number,
	delayMax: PropTypes.number,
	randomizationFactor: PropTypes.number
});
