import React, { FunctionComponent } from 'react';
import WidgetList from '../../../model/WidgetList';
import widgets from '../../../widgets';
import NotFound from '@spectrum-icons/illustrations/NotFound';
import {
	View,
	IllustratedMessage,
	Heading,
	Content
} from '@adobe/react-spectrum';

interface Props {
	widget: keyof WidgetList;
}

export default function WidgetWrapper({ widget }: Props) {
	const Widget: FunctionComponent | null = widgets[widget] || null;

	return Widget ? (
		<Widget />
	) : (
		<View
			width="100%"
			height="100%"
			padding="size-100"
			backgroundColor="gray-200"
		>
			<IllustratedMessage>
				<NotFound />
				<Heading>Widget not found</Heading>
				<Content>Please register "{widget}" in the widget database at:</Content>
				<Content>src/widgets/index.ts</Content>
			</IllustratedMessage>
		</View>
	);
}
