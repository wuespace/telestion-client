import { ReactText, useCallback, useEffect, useState } from 'react';
import { matchPath } from 'react-router';
import { useHistory, useLocation } from 'react-router-dom';
import { StateSelector } from 'zustand';
import { AuthState, useAuth } from '@wuespace/telestion-client-core';

// auth selector
const selector: StateSelector<AuthState, boolean> = ({ auth }) => !auth;

/**
 * The key of a navigation bar element.
 */
export type NavBarKey = string;

/**
 * A link in the navigation bar.
 * It has a title that gets shown and a path
 * where the application is redirecting
 * if the user presses the navigation link.
 */
export interface Link {
	/**
	 * The title of the navigation link.
	 * Gets shown on the navigation page.
	 */
	title: string;

	/**
	 * The path the application takes if the user presses the link.
	 */
	path: NavBarKey;
}

/**
 * The current state of the navigation bar.
 * It is a return type of the {@link useNavBarState} hook
 * which controls the behaviour of the navigation bar.
 */
export interface NavBarState {
	/**
	 * The links that the navigation should render.
	 *
	 * @see {@link Link}
	 */
	items: Array<Link>;

	/**
	 * The navigation link where the {@link Link.path} matches
	 * the current application path.
	 */
	selected: NavBarKey;

	/**
	 * A handler that changes the currently selected navigation element
	 * and the application path.
	 * The application will then, typically, render another registered page.
	 *
	 * @param key - the key of the pressed item
	 */
	onSelectionChange: (key: ReactText) => void;

	/**
	 * If `true`, the navigation should not render a navigation bar,
	 * and should, instead, render a simple message like an application title.
	 */
	isHidden: boolean;
}

export const NAV_BAR_EMPTY_KEY = '';

/**
 * Controls the behaviour of an entire navigation bar.
 * It handles the items, the selection, the application path change
 * and the visibility of the navigation bar.
 *
 * @param links - the links the navigation bar should render
 *
 * @see {@link NavBarState}
 *
 * @example
 * ```ts
 * function MyNavBar() {
 * 	const { items, selected, onSelectionChange, isHidden } = useNavBarState(
 * 		links
 * 	);
 *
 * 	if (isHidden) {
 * 		return <Heading level={4}>{title}</Heading>;
 * 	}
 *
 * 	return (
 * 		<Tabs
 * 			height="100%"
 * 			items={items}
 * 			selectedKey={selected}
 * 			onSelectionChange={onSelectionChange}
 * 		>
 * 			{item => (
 * 				<Item title={item.title} key={item.path}>
 * 					<></>
 * 				</Item>
 * 			)}
 * 		</Tabs>
 * 	);
 * }
 * ```
 */
export function useNavBarState(links: Array<Link> = []): NavBarState {
	// change app path
	const history = useHistory();
	// get current app path
	const location = useLocation();
	// check authentication state
	const isLoggedOut = useAuth(selector);
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
		isHidden: isLoggedOut || links.length === 0
	};
}
