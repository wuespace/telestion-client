import { ReactText, useCallback, useEffect, useMemo, useState } from 'react';
import { StateSelector } from 'zustand';
import { useHistory, useParams } from 'react-router-dom';
import { Dashboard } from '@wuespace/telestion-client-types';
import { AuthState, useAuth } from '@wuespace/telestion-client-core';

// auth selector
const selector: StateSelector<AuthState, boolean> = ({ auth }) => !auth;

export type DashboardPickerKey = string;

export interface Item {
	key: DashboardPickerKey;
	title: string;
}

export interface SelectState {
	items: Array<Item>;

	selected: DashboardPickerKey;

	onSelectionChange: (key: ReactText) => void;

	isDisabled: boolean;

	isHidden: boolean;
}

export const DP_EMPTY_KEY: DashboardPickerKey = '-1';

export function useDashboardState(
	dashboards: Array<Dashboard> = []
): SelectState {
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
