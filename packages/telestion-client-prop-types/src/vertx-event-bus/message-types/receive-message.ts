import PropTypes from 'prop-types';
import { contentMessage } from './content-message';

/**
 * PropType for a receive message
 *
 * See {@link @wuespace/vertx-event-bus#ReceiveMessage}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#ReceiveMessage}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const receiveMessagePropType = PropTypes.shape({
	...contentMessage,
	type: PropTypes.oneOf(['rec']).isRequired
});
