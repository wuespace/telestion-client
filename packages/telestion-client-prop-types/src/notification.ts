import PropTypes from 'prop-types';

/**
 * PropType for a notification type.
 *
 * See {@link @wuespace/telestion-client-types#NotificationType}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#NotificationType}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const notificationTypePropType = PropTypes.oneOf([
	'INFO',
	'SUCCESS',
	'WARNING',
	'ERROR'
]);

/**
 * PropType for a notification.
 *
 * See {@link @wuespace/telestion-client-types#Notification}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#Notification}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const notificationPropType = PropTypes.shape({
	type: notificationTypePropType.isRequired,
	message: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	isDismissed: PropTypes.bool.isRequired
});
