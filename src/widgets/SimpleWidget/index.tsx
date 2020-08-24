import React from 'react';
import { Content, Heading, View } from '@adobe/react-spectrum';

import WidgetProps from '../../model/WidgetProps';
import { MOCK_POSITION } from '../../model/Channels';

import LoadingIndicator from '../components/LoadingIndicator';
import useChannelLatest from '../hooks/useChannelLatest';

export default function SimpleWidget({ title }: WidgetProps) {
	if (typeof title !== 'string')
		throw new Error('SimpleWidget: Title is not a string');

	const data = useChannelLatest(MOCK_POSITION);

	return (
		<LoadingIndicator dependencies={[data]}>
			{() => (
				<View padding="size-100">
					<Heading level={2}>Simple Widget</Heading>
					<Content>This is a very simple widget</Content>
					<Content>{title}</Content>
					<Content>X Coordinate: {data.x}</Content>
					<Content>Y Coordinate: {data.y}</Content>
					<Content>Z Coordinate: {data.z}</Content>
					<Content>Width: {0}</Content>
					<Content>Height: {0}</Content>
				</View>
			)}
		</LoadingIndicator>
	);
}
