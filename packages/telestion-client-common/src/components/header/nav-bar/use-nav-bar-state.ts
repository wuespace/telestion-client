import { ReactText, useCallback, useEffect, useState } from 'react';
import { matchPath } from 'react-router';
import { useHistory, useLocation } from 'react-router-dom';
import { StateSelector } from 'zustand';
import { AuthState, useAuth } from '@wuespace/telestion-client-core';

// auth selector
const selector: StateSelector<AuthState, boolean> = ({ auth }) => !auth;

export type NavBarKey = string;

export interface Link {
	title: string;
	path: NavBarKey;
}

export interface NavBarState {
	items: Array<Link>;

	selected: NavBarKey;

	onSelectionChange: (key: ReactText) => void;

	isHidden: boolean;
}

export const NAV_BAR_EMPTY_KEY = '';

export function useNavBarState(links: Array<Link> = []): NavBarState {
	// change app path
	const history = useHistory();
	// get current app path
	const location = useLocation();
	// check authentication state
	const isHidden = useAuth(selector);
	// store selected key
	const [selected, setSelected] = useState<NavBarKey>(NAV_BAR_EMPTY_KEY);

	// sync selection with current route
	useEffect(() => {
		// in the end contains the correct key
		let key = NAV_BAR_EMPTY_KEY;
		// check current location against every route to select current nav link
		links.forEach(({ path }) => {
			if (matchPath(location.pathname, { path })) {
				key = path;
			}
		});
		setSelected(key);
	}, [links, location]);

	const onSelectionChange = useCallback(
		(key: ReactText) => {
			// apply key to state
			setSelected(key as string);
			// set route to selected key
			if (key !== NAV_BAR_EMPTY_KEY && key !== history.location.pathname) {
				history.push(key as string);
			}
		},
		[history]
	);

	return {
		items: links,
		selected,
		onSelectionChange,
		isHidden: isHidden || links.length === 0
	};
}
