import PropTypes from 'prop-types';
import { Heading } from '@adobe/react-spectrum';
import { Item, Tabs } from '@react-spectrum/tabs';
import { useTitle } from '@wuespace/telestion-client-core';
import { Link, useNavBarState } from './use-nav-bar-state';

/**
 * React Props of {@link NavBar}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link NavBar}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface NavBarProps {
	/**
	 * Links to display in a tab list.
	 * If no links are set the application are shown.
	 *
	 * @see {@link Link}
	 */
	links?: Array<Link>;
}

/**
 * Part of the Telestion Client Common header.
 *
 * It displays the given links in a React Spectrum tab list.
 * If no links are set the application title are shown instead.
 *
 * @see {@link https://react-spectrum.adobe.com/react-spectrum/Tabs.html}
 * @see {@link NavBarProps}
 * @see {@link Header}
 *
 * @example
 * Display only title:
 * ```ts
 * function AppHeader() {
 * 	return (
 * 		<Header
 * 			left={<NavBar />}
 * 		/>
 * 	);
 * }
 * ```
 *
 * Display some links:
 * ```ts
 * const links: Array<Link> = [
 * 	{
 * 		title: 'Dashboards',
 * 		path: '/dashboard'
 * 	},
 * 	{
 * 		title: 'Preferences',
 * 		path: '/preferences'
 * 	}
 * ];
 *
 * function AppHeader() {
 * 	return (
 * 		<Header
 * 			left={<NavBar links={links} />}
 * 		/>
 * 	);
 * }
 * ```
 */
export function NavBar({ links }: NavBarProps) {
	const title = useTitle();
	const { items, selected, onSelectionChange, isHidden } = useNavBarState(
		links
	);

	if (isHidden) {
		return <Heading level={4}>{title}</Heading>;
	}

	// render tab list with empty contents
	// and hear on selection change instead
	return (
		<Tabs
			items={items}
			selectedKey={selected}
			onSelectionChange={onSelectionChange}
		>
			{item => (
				<Item title={item.title} key={item.path}>
					<></>
				</Item>
			)}
		</Tabs>
	);
}

NavBar.propTypes = {
	links: PropTypes.arrayOf(
		PropTypes.shape({
			title: PropTypes.string.isRequired,
			path: PropTypes.string.isRequired
		})
	)
};
