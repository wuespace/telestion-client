import PropTypes from 'prop-types';
import { addressableMessage } from './addressable-message';

/**
 * PropType for a error message
 *
 * See {@link @wuespace/vertx-event-bus#ErrorMessage}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#ErrorMessage}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const errorMessagePropType = PropTypes.shape({
	...addressableMessage,
	type: PropTypes.oneOf(['err']).isRequired,
	failureCode: PropTypes.number.isRequired,
	failureType: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired
});
