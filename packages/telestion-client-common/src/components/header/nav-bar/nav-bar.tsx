import PropTypes from 'prop-types';
import { Heading } from '@adobe/react-spectrum';
import { Tabs, Item } from '@react-spectrum/tabs';
import { useTitle } from '@wuespace/telestion-client-core';
import { Link, useNavBarState } from './use-nav-bar-state';

export interface NavBarProps {
	links?: Array<Link>;
}

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
			height="100%"
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
