import PropTypes from 'prop-types';
import { baseMessage } from './base-message';

/**
 * PropType for a ping message
 *
 * See {@link @wuespace/vertx-event-bus#PingMessage} for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#PingMessage}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const pingMessagePropType = PropTypes.shape({
	...baseMessage,
	type: PropTypes.oneOf(['ping']).isRequired
});
