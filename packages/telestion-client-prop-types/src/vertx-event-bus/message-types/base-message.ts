import PropTypes from 'prop-types';
import { messageTypePropType } from './message-type-prop-type';

export const baseMessage = {
	type: messageTypePropType.isRequired
};
/**
 * PropType for a base message
 *
 * See {@link @wuespace/vertx-event-bus#BaseMessage}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#BaseMessage}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const baseMessagePropType = PropTypes.shape(baseMessage);
