import PropTypes from 'prop-types';
import { baseMessage } from './base-message';
import { headersPropType } from './headers-prop-type';

export const addressableMessage = {
	...baseMessage,
	headers: headersPropType.isRequired,
	replyAddress: PropTypes.string,
	reply: PropTypes.func
};
/**
 * PropType for a addressable message
 *
 * See {@link @wuespace/vertx-event-bus#AddressableMessage}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#AddressableMessage}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const addressableMessagePropType = PropTypes.shape(addressableMessage);
