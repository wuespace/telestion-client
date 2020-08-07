import React from 'react';
import { View, Text } from '@adobe/react-spectrum';

import DashboardType from '../../../model/Dashboard';

interface Props {
	dashboard: DashboardType;
}

export default function Dashboard({ dashboard }: Props) {
	return (
		<View flexGrow={1} width="100%">
			<Text>{JSON.stringify(dashboard, null, 2)}</Text>
		</View>
	);
}
