import { StateSelector } from 'zustand';
import shallow from 'zustand/shallow';
import { TooltipTrigger, Tooltip, ActionButton } from '@adobe/react-spectrum';
import {
	NotificationState,
	useNotifications
} from '@wuespace/telestion-client-core';

import RemoveCircle from '@spectrum-icons/workflow/RemoveCircle';
import Bell from '@spectrum-icons/workflow/Bell';

// notification selector
const selector: StateSelector<
	NotificationState,
	{
		isMuted: NotificationState['isMuted'];
		toggle: NotificationState['toggle'];
	}
> = state => ({
	isMuted: state.isMuted,
	toggle: state.toggle
});

/**
 * Part of the header actions.
 *
 * This action lets the user control the current notification state
 * of the application.
 *
 * The user can switch between normal notification and silent mode.
 * In silent mode, no more notifications are displayed.
 * For more information take a look on the
 * {@link @wuespace/telestion-client-core#useNotifications} hook.
 *
 * @see {@link @wuespace/telestion-client-core#useNotifications}
 * @see {@link Actions}
 *
 * @example
 * ```ts
 * function MyActions() {
 * 	return (
 * 		<Actions>
 * 			<NotificationAction />
 * 		</Actions>
 * 	);
 * }
 * ```
 */
export function NotificationAction() {
	const { isMuted, toggle } = useNotifications(selector, shallow);
	return (
		<TooltipTrigger>
			<ActionButton onPress={toggle} isQuiet>
				{isMuted ? <RemoveCircle width="100%" /> : <Bell width="100%" />}
			</ActionButton>
			<Tooltip>
				{isMuted ? 'Allow notifications' : 'Block notifications'}
			</Tooltip>
		</TooltipTrigger>
	);
}
