import PropTypes from 'prop-types';

/**
 * PropType for json serializable data
 *
 * See {@link @wuespace/vertx-event-bus#JsonSerializable}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#JsonSerializable}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const jsonSerializablePropType = PropTypes.oneOfType([
	PropTypes.number,
	PropTypes.string,
	PropTypes.bool,
	PropTypes.object,
	PropTypes.array
]);

/**
 * PropType for event bus message headers
 *
 * See {@link @wuespace/vertx-event-bus#Headers}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#Headers}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const headersPropType = PropTypes.object;

/**
 * PropType for an event bus message type
 *
 * See {@link @wuespace/vertx-event-bus#BaseMessage."type"}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#BaseMessage."type"}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const messageTypePropType = PropTypes.oneOf([
	'ping',
	'register',
	'unregister',
	'publish',
	'send',
	'rec',
	'err'
]);

const baseMessage = {
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

const addressableMessage = {
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

const contentMessage = {
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

/**
 * PropType for a error message
 *
 * See {@link @wuespace/vertx-event-bus#ErrorMessage}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#ErrorMessage}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const errorMessagePropType = PropTypes.shape({
	...addressableMessage,
	type: PropTypes.oneOf(['err']).isRequired,
	failureCode: PropTypes.number.isRequired,
	failureType: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired
});

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
