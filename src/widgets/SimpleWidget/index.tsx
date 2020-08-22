import React, { useState } from 'react';
import { View, Heading, Content } from '@adobe/react-spectrum';
import WidgetProps from '../../model/WidgetProps';
import useChannel from '../hooks/useChannel';

export default function SimpleWidget({ title }: WidgetProps) {
	const [data, setData] = useState<any>({});
	const success = useChannel('myAwesomeChannel', setData);

	if (!success)
		throw new Error('SimpleWidget: Channel "myAwesomeChannel" is not defined');

	if (typeof title !== 'string')
		throw new Error('SimpleWidget: Title is not a string');

	return (
		<View
			padding="size-100"
		>
			<Heading level={2}>Simple Widget</Heading>
			<Content>This is a very simple widget</Content>
			<Content>{title}</Content>
			<Content>Counter: {data.counter}</Content>
			<Content>Width: {0}</Content>
			<Content>Height: {0}</Content>
		</View>
	);
}
