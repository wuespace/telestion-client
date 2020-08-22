import React, { useEffect, useState } from 'react';
import { Picker, Item } from '@adobe/react-spectrum';
import { useHistory, useRouteMatch } from 'react-router-dom';

import useAppState from '../../../hooks/useAppState';

export default function DashboardPicker() {
	const [{ user }] = useAppState();
	const { dashboards } = user!;

	const history = useHistory();
	const match = useRouteMatch('/dashboard/:id');
	const params = (match?.params as { id: string }) || { id: '0' };

	const [selected, setSelected] = useState(params.id);

	// sync selection state with current route
	useEffect(() => {
		setSelected(params.id);
	}, [params.id]);

	// sync history with picker state
	useEffect(() => {
		const newPath = `/dashboard/${selected}`;
		if (history.location.pathname !== newPath) {
			history.push(newPath);
		}
	}, [history, selected]);

	const options = dashboards.map((dashboard, index) => ({
		...dashboard,
		id: index.toString()
	}));

	return (
		<Picker
			label="Dashboard"
			labelPosition="side"
			items={options}
			selectedKey={selected}
			onSelectionChange={selected => setSelected(selected as string)}
		>
			{item => <Item key={item.id}>{item.name}</Item>}
		</Picker>
	);
}
