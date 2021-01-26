/**
 * The type of a notification.
 * A notification of this type will show in the app in a specific way.
 */
export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

/**
 * A generic notification that can be showed and stored.
 * It has a {@link NotificationType | notification type}
 * and a dismissed flag to show the dismiss state.
 */
export interface Notification {
	/**
	 * The type of the notification.
	 */
	type: NotificationType;

	/**
	 * The message of the notification.
	 * Usually it is a short abstract of the description
	 * and should not be multi-line.
	 */
	message: string;

	/**
	 * The description of the notification.
	 * Usually contains more detailed information and can be multi-line.
	 */
	description: string;

	/**
	 * Is `true` if the notification is dismissed.
	 */
	isDismissed: boolean;
}
