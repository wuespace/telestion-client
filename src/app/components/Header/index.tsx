import React from 'react';
import { View, Flex } from '@adobe/react-spectrum';

import Logo from './Logo';
import DashboardPicker from './DashboardPicker';
import AdminPanel from './AdminPanel';

export default function Header() {
	return (
		<View
			flexGrow={0}
			width="100%"
			paddingStart="size-100"
			paddingEnd="size-100"
			height="size-800"
			backgroundColor="gray-200"
		>
			<Flex
				direction="row"
				height="100%"
				justifyContent="space-between"
				alignItems="center"
				gap="size-100"
			>
				<Logo />
				<DashboardPicker />
				<AdminPanel />
			</Flex>
		</View>
	);
}
