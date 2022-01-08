import {
	NotificationState,
	useLogger,
	useNotifications
} from '@wuespace/telestion-client-core';
import { useEffect } from 'react';
import { StateSelector } from 'zustand';

// static selector
const notificationSelector: StateSelector<
	NotificationState,
	[
		NotificationState['notifications'],
		NotificationState['isMuted'],
		NotificationState['dismiss']
	]
> = notificationStore => [
	notificationStore.notifications,
	notificationStore.isMuted,
	notificationStore.dismiss
];

/**
 * Enables and handles the usage of native desktop notifications for implementing the
 * `@wuespace/telestion-client-core`'s abstract `useNotifications` APIs.
 *
 * Call this hook once in your `app.tsx` and everything else gets handled for you.
 *
 * @see {@link @wuespace/telestion-client-core#useNotifications}
 *
 * @example
 * ```ts
 * // [...]
 * import { useDesktopNotifications } from '@wuespace/telestion-client-common';
 *
 * export function App() {
 *     useDesktopNotifications();
 *
 *     useEventBusManager();
 *     // [...]
 *
 *     return <TelestionClient>
 *         // [...]
 *     </TelestionClient>
 * }
 * ```
 */
export function useDesktopNotifications(): void {
	const logger = useLogger('Desktop Notifications');

	const [notifications, isMuted, dismiss] =
		useNotifications(notificationSelector);

	// Request permission on launch
	useEffect(() => {
		if (window.Notification.permission !== 'granted') {
			logger.debug(
				'Requesting desktop notification permission since ' +
					'Notification.permission is not "granted"'
			);
			window.Notification.requestPermission()
				.then(() => logger.success('Permission granted'))
				.catch(e => logger.warn('Permission got denied. Details:', e));
		}
	}, []);

	// Send desktop notifications for new notifications in notification store
	useEffect(() => {
		if (window.Notification.permission !== 'granted') {
			logger.debug(
				'Tried sending new notifications, but permission is not granted. Aborting.'
			);
			return;
		}

		const notificationsToShow = notifications.filter(n => !n.isDismissed);

		if (!isMuted && notificationsToShow.length > 0) {
			notificationsToShow.forEach(notification => {
				logger.debug('Sending desktop notification for', notification);

				// eslint-disable-next-line no-new
				new window.Notification(notification.message, {
					body: notification.description
				});
			});
			dismiss(notificationsToShow);
		}
	}, [notifications, isMuted, dismiss]);
}
