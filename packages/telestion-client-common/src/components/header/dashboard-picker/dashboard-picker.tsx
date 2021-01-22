import { TooltipTrigger, Tooltip, Picker, Item } from '@adobe/react-spectrum';
import { useCurrentDashboards } from '../../../hooks';
import { emptyKey, useSelectState } from './use-select-state';

export function DashboardPicker() {
	const [dashboards] = useCurrentDashboards();
	const { items, selected, setSelected, shouldRender } = useSelectState(
		dashboards
	);

	if (shouldRender) {
		return (
			<TooltipTrigger>
				<Picker
					placeholder="No dashboards"
					isDisabled={selected === emptyKey}
					items={items}
					selectedKey={selected}
					onSelectionChange={setSelected}
				>
					{item => <Item key={item.key}>{item.title}</Item>}
				</Picker>
				<Tooltip>Switch to another dashboard</Tooltip>
			</TooltipTrigger>
		);
	}

	return null;
}
