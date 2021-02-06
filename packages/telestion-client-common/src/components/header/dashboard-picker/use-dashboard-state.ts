import { ReactText, useCallback, useEffect, useMemo, useState } from 'react';
import { StateSelector } from 'zustand';
import { useHistory, useParams } from 'react-router-dom';
import { Dashboard } from '@wuespace/telestion-client-types';
import { AuthState, useAuth } from '@wuespace/telestion-client-core';

// auth selector
const selector: StateSelector<AuthState, boolean> = ({ auth }) => !auth;

/**
 * The key of a picker element which represents a dashboard in the picker.
 */
export type DashboardPickerKey = string;

/**
 * The item of a dashboard picker.
 * It has a title that is shown on selection
 * and a key of the dashboard to show
 * when the user presses the picker element.
 */
export interface Item {
	/**
	 * The dashboard key the picker item refer to.
	 */
	key: DashboardPickerKey;

	/**
	 * The title to show if the dashboard is active.
	 * It is usually the title of the dashboard.
	 */
	title: string;
}

/**
 * The current state of the dashboard picker.
 * It is a return type of the {@link useDashboardState} hook
 * which controls the behaviour of the dashboard picker.
 */
export interface PickerState {
	/**
	 * The picker elements the dashboard picker should render.
	 *
	 * @see {@link Item}
	 */
	items: Array<Item>;

	/**
	 * The picker element where the {@link Item.key}
	 * matches the currently active dashboard.
	 */
	selected: DashboardPickerKey;

	/**
	 * A handler that changes the currently selected picker element
	 * and the application path to the new dashboard.
	 * The application will then, typically, render the dashboard
	 * with the specified {@link Item.key}.
	 *
	 * @param key - the key of the pressed item
	 */
	onSelectionChange: (key: ReactText) => void;

	/**
	 * If `true`, the dashboard picker should be disabled
	 * and show the placeholder text
	 * because there are no registered dashboards.
	 */
	isDisabled: boolean;

	/**
	 * If `true`, the dashboard picker should hide itself.
	 */
	isHidden: boolean;
}

export const DP_EMPTY_KEY: DashboardPickerKey = '-1';

/**
 * Controls the behaviour of the entire dashboard picker.
 * It handles the items, the current selection, the visibility
 * and hears on events.
 *
 * @param dashboards - the dashboards the current user have
 *
 * @see {@link PickerState}
 *
 * @example
 * ```ts
 * function DashboardPicker() {
 * 	const [dashboards] = useCurrentDashboards();
 * 	const {
 * 		items,
 * 		selected,
 * 		onSelectionChange,
 * 		isDisabled,
 * 		isHidden
 * 	} = useDashboardState(dashboards);
 *
 * 	if (isHidden) {
 * 		return null;
 * 	}
 *
 * 	return (
 * 		<TooltipTrigger>
 * 			<Picker
 * 				aria-label="Select a dashboard to view"
 * 				placeholder="No dashboards"
 * 				isDisabled={isDisabled}
 * 				items={items}
 * 				selectedKey={selected}
 * 				onSelectionChange={onSelectionChange}
 * 			>
 * 				{item => <Item key={item.key}>{item.title}</Item>}
 * 			</Picker>
 * 			<Tooltip>Switch to another dashboard</Tooltip>
 * 		</TooltipTrigger>
 * 	);
 * }
 * ```
 */
export function useDashboardState(
	dashboards: Array<Dashboard> = []
): PickerState {
	// change app path
	const history = useHistory();
	// get current dashboard id
	const { id } = useParams<{ id: DashboardPickerKey | undefined }>();
	// check authentication state
	const isLoggedOut = useAuth(selector);
	// store selected key
	const [selected, setSelected] = useState<DashboardPickerKey>(
		id || DP_EMPTY_KEY
	);

	// sync selection with current route
	useEffect(() => {
		setSelected(id || DP_EMPTY_KEY);
	}, [id]);

	const onSelectionChange = useCallback(
		(key: ReactText) => {
			// apply key to state
			setSelected(key as DashboardPickerKey);
			const newPath = `/dashboard/${key}`;
			// set route to selected key
			if (key !== DP_EMPTY_KEY && newPath !== history.location.pathname) {
				history.push(newPath);
			}
		},
		[history]
	);

	const items: Array<Item> = useMemo(() => {
		return dashboards.map((dashboard, index) => ({
			key: `${index}`,
			title: dashboard.title
		}));
	}, [dashboards]);

	return {
		items,
		selected,
		onSelectionChange,
		isDisabled: !dashboards,
		isHidden: isLoggedOut
	};
}
