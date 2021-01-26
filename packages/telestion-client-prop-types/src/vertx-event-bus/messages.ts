import PropTypes from 'prop-types';
import {
	errorMessagePropType,
	pingMessagePropType,
	publishMessagePropType,
	receiveMessagePropType,
	registerMessagePropType,
	sendMessagePropType,
	unregisterMessagePropType
} from './message-types';

/**
 * PropType for any event bus message
 *
 * See {@link @wuespace/vertx-event-bus#Message}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#Message}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const messagePropType = PropTypes.oneOfType([
	pingMessagePropType,
	registerMessagePropType,
	unregisterMessagePropType,
	publishMessagePropType,
	sendMessagePropType,
	receiveMessagePropType,
	errorMessagePropType
]);

/**
 * PropType for a callback which is used in an event bus instance
 *
 * See {@link @wuespace/vertx-event-bus#Callback}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#Callback}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const callbackPropType = PropTypes.func;
