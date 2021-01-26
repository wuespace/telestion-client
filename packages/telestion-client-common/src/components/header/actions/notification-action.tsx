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

export function NotificationAction() {
	const { isMuted, toggle } = useNotifications(selector, shallow);

	return (
		<TooltipTrigger>
			<ActionButton onPress={toggle}>
				{isMuted ? <RemoveCircle /> : <Bell />}
			</ActionButton>
			<Tooltip>
				{isMuted ? 'Allow notifications' : 'Block notifications'}
			</Tooltip>
		</TooltipTrigger>
	);
}
