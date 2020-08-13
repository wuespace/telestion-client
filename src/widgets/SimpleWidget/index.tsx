import React from 'react';
import { View, Text, Heading } from '@adobe/react-spectrum';

export default function SimpleWidget() {
	return (
		<View
			backgroundColor="gray-200"
			width="100%"
			height="100%"
			padding="size-100"
		>
			<Heading level={2}>Simple Widget</Heading>
			<Text>This is a very simple widget</Text>
		</View>
	);
}
