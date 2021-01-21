import PropTypes from 'prop-types';
import { contentMessage } from './content-message';

/**
 * PropType for a send message
 *
 * See {@link @wuespace/vertx-event-bus#SendMessage}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#SendMessage}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const sendMessagePropType = PropTypes.shape({
	...contentMessage,
	type: PropTypes.oneOf(['send']).isRequired
});
