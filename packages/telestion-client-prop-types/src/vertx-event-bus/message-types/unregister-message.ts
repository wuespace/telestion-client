import PropTypes from 'prop-types';
import { addressableMessage } from './addressable-message';

/**
 * PropType for a unregister message
 *
 * See {@link @wuespace/vertx-event-bus#UnregisterMessage}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#UnregisterMessage}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const unregisterMessagePropType = PropTypes.shape({
	...addressableMessage,
	type: PropTypes.oneOf(['unregister']).isRequired
});
