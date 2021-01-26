import PropTypes from 'prop-types';
import { addressableMessage } from './addressable-message';

/**
 * PropType for a register message
 *
 * See {@link @wuespace/vertx-event-bus#RegisterMessage}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#RegisterMessage}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const registerMessagePropType = PropTypes.shape({
	...addressableMessage,
	type: PropTypes.oneOf(['register']).isRequired
});
