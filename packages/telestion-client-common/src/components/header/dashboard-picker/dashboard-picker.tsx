import { TooltipTrigger, Tooltip, Picker, Item } from '@adobe/react-spectrum';
import { useCurrentDashboards } from '../../../hooks';
import { useDashboardState } from './use-dashboard-state';

export function DashboardPicker() {
	const [dashboards] = useCurrentDashboards();
	const {
		items,
		selected,
		onSelectionChange,
		isDisabled,
		isHidden
	} = useDashboardState(dashboards);

	if (isHidden) {
		return null;
	}

	return (
		<TooltipTrigger>
			<Picker
				placeholder="No dashboards"
				isDisabled={isDisabled}
				items={items}
				selectedKey={selected}
				onSelectionChange={onSelectionChange}
			>
				{item => <Item key={item.key}>{item.title}</Item>}
			</Picker>
			<Tooltip>Switch to another dashboard</Tooltip>
		</TooltipTrigger>
	);
}
