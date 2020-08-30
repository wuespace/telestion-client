import React from 'react';
import { View, Heading, Checkbox, Form } from '@adobe/react-spectrum';

export default function LogWidget() {
	return (
		<View padding="size-100">
			<Heading level={2}>Procedure</Heading>
			<Form>
				<Checkbox>Item 1</Checkbox>
				<Checkbox>Item 2</Checkbox>
				<Checkbox>Item 3</Checkbox>
			</Form>
		</View>
	);
}
