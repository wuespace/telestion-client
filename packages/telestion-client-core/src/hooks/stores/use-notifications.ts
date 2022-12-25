import create from 'zustand';
import { NotificationState } from './use-notification.model';
import { getLogger } from '../../lib';

const logger = getLogger('Notifications');

/**
 * Returns the notification state and actions to interact with.
 * A selector can be defined to pick out parts of the store.
 * If correctly set up, the function only triggers a rerender
 * if the selected values have changed.
 *
 * For more information about state management in Zustand,
 * take a look at their {@link https://github.com/pmndrs/zustand | GitHub page}.
 *
 * @param selector - optional selector function
 * which picks the specified elements out of the store
 * @param equalityFn - optional equality function
 * to check for state updates on the picked elements
 * @returns the picked elements in the selector function
 *
 * @see {@link NotificationState}
 * @see {@link https://github.com/pmndrs/zustand}
 * @see {@link UseBoundStore}
 * @see {@link zustand#shallow}
 *
 * @example
 * Fetch stored notifications from the store:
 * ```ts
 * function Notifications() {
 * 	const notifications = useNotifications(state => state.notifications);
 *
 * 	return (
 * 		<ul>
 * 			{notifications.map(notification => (
 * 				<li>{`${notification.message}: ${notification.description}`}</li>
 * 			)}
 * 		</ul>
 * 	);
 * }
 * ```
 *
 * Performance optimized and type-safe fetching from the store:
 * ```ts
 * import { useCallback, ReactNode } from 'react';
 * import { StateSelector } from 'zustand';
 * import shallow from 'zustand/shallow';
 * import {
 * 	useNotifications,
 * 	NotificationState
 * } from '@wuespace/telestion-client-core';
 *
 * // selector does not depend on scope, so it's better to define it outside
 * // to not re-declare it on every render
 * const selector: StateSelector<
 * 	NotificationState,
 * 	{
 * 		showAll: NotificationState['showAll'],
 * 		mute: NotificationState['mute'],
 * 		unmute: NotificationState['unmute']
 * 	}
 * > = state => ({
 * 	showAll: state.showAll,
 * 	mute: state.mute,
 * 	unmute: state.unmute
 * });
 *
 * function MyComponent() {
 * 	const { showAll, mute, unmute } = useAuth(selector, shallow);
 *
 * 	return (
 * 		<div>
 * 			<button onClick={showAll}>Show all notifications</button>
 * 			<button onClick={mute}>Mute all new notifications</button>
 * 			<button onClick={unmute}>Unmute all new notifications</button>
 * 		</div>
 * 	);
 * }
 * ```
 */
export const useNotifications = create<NotificationState>((set, get) => ({
	notifications: [],
	isMuted: false,
	add: notifications => {
		logger.debug('Add new notifications');
		if (!notifications.length) return;
		// dismiss all notifications on mute
		if (get().isMuted) {
			logger.info('Mute all notifications');
			notifications.forEach(notification => {
				// eslint-disable-next-line no-param-reassign
				notification.isDismissed = true;
			});
		}
		set({ notifications: [...get().notifications, ...notifications] });
	},
	dismiss: notifications => {
		logger.debug('Dismiss notifications');
		if (!notifications.length) return;
		const storeNotifications = get().notifications;
		storeNotifications.forEach(current => {
			if (notifications.includes(current)) {
				// eslint-disable-next-line no-param-reassign
				current.isDismissed = true;
			}
		});
		set({ notifications: [...storeNotifications] });
	},
	showAll: () => {
		logger.debug('Show all notifications');
		const { notifications } = get();
		notifications.forEach(current => {
			// eslint-disable-next-line no-param-reassign
			current.isDismissed = false;
		});
		set({ notifications: [...notifications] });
	},
	mute: () => {
		logger.debug('Mute all further notifications');
		const { notifications } = get();
		notifications.forEach(notification => {
			// eslint-disable-next-line no-param-reassign
			notification.isDismissed = false;
		});
		set({ notifications: [...notifications], isMuted: true });
	},
	unmute: () => {
		logger.debug('Unmute all further notifications');
		set({ isMuted: false });
	},
	toggle: () => {
		logger.debug('Toggle mute state to', !get().isMuted);
		set({ isMuted: !get().isMuted });
	}
}));
