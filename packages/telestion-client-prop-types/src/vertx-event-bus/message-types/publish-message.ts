import PropTypes from 'prop-types';
import { contentMessage } from './content-message';

/**
 * PropType for a publish message
 *
 * See {@link @wuespace/vertx-event-bus#PublishMessage}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#PublishMessage}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const publishMessagePropType = PropTypes.shape({
	...contentMessage,
	type: PropTypes.oneOf(['publish']).isRequired
});
