import { ReactText, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Heading } from '@adobe/react-spectrum';
import { Tabs, Item } from '@react-spectrum/tabs';
import { useTitle } from '@wuespace/telestion-client-core';

export interface Link {
	title: string;
	path: string;
}

export interface NavBarProps {
	links?: Link[];
}

export function NavBar({ links }: NavBarProps) {
	const title = useTitle();
	const history = useHistory();

	const changeAppPath = useCallback(
		(path: ReactText) => {
			if (typeof path === 'string') {
				history.push(path);
			}
		},
		[history]
	);

	if (links) {
		// render tab list with empty contents
		// and hear on selection change instead
		return (
			<Tabs height="100%" items={links} onSelectionChange={changeAppPath}>
				{link => (
					<Item title={link.title} key={link.path}>
						<></>
					</Item>
				)}
			</Tabs>
		);
	}

	// instead render app title
	return <Heading level={4}>{title}</Heading>;
}

NavBar.propTypes = {
	links: PropTypes.arrayOf(
		PropTypes.shape({
			title: PropTypes.string.isRequired,
			path: PropTypes.string.isRequired
		})
	)
};
