import { Notification } from '@wuespace/telestion-client-types';

/**
 * The notification state and actions of the Telestion Client Core.
 *
 * Stores and handles the notifications of the application.
 *
 * @see {@link NotificationState.notifications}
 * @see {@link NotificationState.add}
 * @see {@link NotificationState.toggle}
 */
export interface NotificationState {
	/**
	 * Stores all notifications.
	 * Every notification has a `isDismissed` flag which indicates
	 * that the notification was shown in the current environment.
	 *
	 * To add notifications, call {@link NotificationState.add}.
	 * To mute all further notifications, call {@link NotificationState.mute}.
	 *
	 * @see {@link @wuespace/telestion-client-types#Notification}
	 * @see {@link NotificationState.add}
	 *
	 * @example
	 * Log all new notifications
	 * ```ts
	 * function useNotificationLogger() {
	 * 	const { notifications, dismiss } = useNotifications(state => ({
	 * 	  notifications: state.notifications,
	 * 		dismiss: state.dismiss
	 * 	}));
	 *
	 * 	useEffect(() => {
	 * 		// filter out all new notifications
	 * 		const new = notifications.filter(notification => !notification.isDismissed);
	 * 		// log them
	 * 		new.forEach(notification => {
	 * 			console.log(`${notification.message}: ${notification.description}`);
	 * 		});
	 * 		// and dismiss them to not log them again
	 * 		dismiss(new);
	 * 	}, [notification, dismiss]);
	 * }
	 * ```
	 */
	notifications: Array<Notification>;

	/**
	 * If `true` all notifications are muted.
	 *
	 * Now for all incoming notifications
	 * the `isDismissed` flag is set by default.
	 *
	 * @see {@link @wuespace/telestion-client-types#Notification}
	 * @see {@link NotificationState.notifications}
	 */
	isMuted: boolean;

	/**
	 * Adds a new notification to the notification store and displays it.
	 * @param notifications - the notifications to add
	 *
	 * @see {@link @wuespace/telestion-client-types#Notification}
	 * @see {@link NotificationState.notifications}
	 *
	 * @example
	 * Display a notification on button press
	 * ```ts
	 * function NotificationGenerator() {
	 * 	const add = useNotifications(state => state.add);
	 *
	 * 	const notification: Notification = {
	 * 		type: 'INFO',
	 * 		message: 'Button pressed',
	 * 		description: 'Someone pressed the button',
	 * 		isDismissed: false
	 * 	};
	 *
	 * 	return <button onClick={() => add(notification)}>New notification</button>;
	 * }
	 * ```
	 */
	add: (notifications: Notification[]) => void;

	/**
	 * Dismisses a notification in the notification store.
	 * @param notifications - the notifications to dismiss
	 *
	 * @see {@link @wuespace/telestion-client-types#Notification}
	 * @see {@link NotificationState.notifications}
	 * @see {@link NotificationState.add}
	 *
	 * @example
	 * Log all new notifications
	 * ```ts
	 * function useNotificationLogger() {
	 * 	const { notifications, dismiss } = useNotifications(state => ({
	 * 	  notifications: state.notifications,
	 * 		dismiss: state.dismiss
	 * 	}));
	 *
	 * 	useEffect(() => {
	 * 		// filter out all new notifications
	 * 		const new = notifications.filter(notification => !notification.isDismissed);
	 * 		// log them
	 * 		new.forEach(notification => {
	 * 			console.log(`${notification.message}: ${notification.description}`);
	 * 		});
	 * 		// and dismiss them to not log them again
	 * 		dismiss(new);
	 * 	}, [notification, dismiss]);
	 * }
	 * ```
	 */
	dismiss: (notifications: Notification[]) => void;

	/**
	 * Reset all dismissed notifications to show them again.
	 *
	 * Internally on all stored notifications the `isDismissed` flag is reset
	 * to handle them as "new" notifications.
	 *
	 * @see {@link @wuespace/telestion-client-types#Notification}
	 * @see {@link NotificationState.notifications}
	 * @see {@link NotificationState.add}
	 *
	 * @example
	 * Show all notifications button
	 * ```ts
	 * function ShowAllNotifications() {
	 * 	// log all notifications to console
	 * 	useNotificationLogger();
	 *
	 * 	const showAll = useNotifications(state => state.showAll);
	 *
	 * 	return <button onClick={showAll}>Show all notifications</button>;
	 * }
	 * ```
	 */
	showAll: () => void;

	/**
	 * Mutes all further notifications.
	 *
	 * @see {@link NotificationState.isMuted}
	 * @see {@link NotificationState.add}
	 *
	 * @example
	 * Mute all incoming notifications
	 * ```ts
	 * function Mute() {
	 * 	const mute = useNotifications(state => state.mute);
	 *
	 * 	return <button onClick={mute}>Mute</button>;
	 * }
	 * ```
	 */
	mute: () => void;

	/**
	 * Unmutes all further notifications.
	 *
	 * @see {@link NotificationState.isMuted}
	 * @see {@link NotificationState.add}
	 *
	 * @example
	 * Unmute all incoming notifications
	 * ```ts
	 * function Mute() {
	 * 	const unmute = useNotifications(state => state.unmute);
	 *
	 * 	return <button onClick={unmute}>Unmute</button>;
	 * }
	 * ```
	 */
	unmute: () => void;

	/**
	 * Toggles the current mute state to its counter state.
	 *
	 * @see {@link NotificationState.isMuted}
	 * @see {@link NotificationState.add}
	 *
	 * @example
	 * Toggle mute all incoming notifications
	 * ```ts
	 * function ToggleMute() {
	 * 	const toggle = useNotifications(state => state.toggle);
	 *
	 * 	return <button onClick={toggle}>Toggle mute</button>;
	 * }
	 * ```
	 */
	toggle: () => void;
}
