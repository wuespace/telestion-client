import PropTypes from 'prop-types';
import { addressableMessage } from './addressable-message';
import { jsonSerializablePropType } from '../../json-serializable';

export const contentMessage = {
	...addressableMessage,
	body: jsonSerializablePropType.isRequired
};
/**
 * PropType for a content message.
 *
 * See {@link @wuespace/vertx-event-bus#ContentMessage}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#ContentMessage}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const contentMessagePropType = PropTypes.shape(contentMessage);
