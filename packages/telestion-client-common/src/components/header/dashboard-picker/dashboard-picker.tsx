import { TooltipTrigger, Tooltip, Picker, Item } from '@adobe/react-spectrum';
import { useCurrentDashboards } from '../../../hooks';
import { useDashboardState } from './use-dashboard-state';

/**
 * Part of the Telestion Client Common header.
 *
 * It displays a picker element which lists all available dashboards
 * the current user have.
 *
 * If the user has no dashboard defined yet, it renders a placeholder message.
 * It detects path changes and triggers path changes
 * to the necessary dashboard page.
 *
 * If nobody is logged in, it hides itself a valid authentication arrives.
 *
 * @see {@link https://react-spectrum.adobe.com/react-spectrum/Picker.html}
 * @see {@link Header}
 *
 * @example
 * ```ts
 * function AppHeader() {
 * 	return (
 * 		<Header
 * 			middle={<DashboardPicker />}
 * 		/>
 * 	);
 * }
 * ```
 */
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
				aria-label="Select a dashboard to view"
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
