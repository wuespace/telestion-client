import React, { FunctionComponent } from 'react';
import NotFoundIllustration from '@spectrum-icons/illustrations/NotFound';

import WidgetList from '../../../model/dashboard/WidgetList';
import WidgetProps from '../../../model/dashboard/WidgetProps';

import WidgetErrorMessage from './WidgetErrorMessage';

import widgets from '../../../widgets';
import { View } from '@adobe/react-spectrum';

interface Props {
	widget: keyof WidgetList;
	props: WidgetProps;
}

interface State {
	error: Error | null;
	errorInfo: React.ErrorInfo | null;
}

// class component (not important)
// see: https://reactjs.org/docs/components-and-props.html
export default class WidgetWrapper extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { error: null, errorInfo: null };

		this.reloadWidget = this.reloadWidget.bind(this);
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		this.setState({ error, errorInfo });
	}

	reloadWidget() {
		this.setState({ error: null, errorInfo: null });
	}

	render() {
		const { widget, props } = this.props;
		const { error } = this.state;

		const Widget: FunctionComponent<WidgetProps> | null =
			widgets[widget] || null;

		if (error) {
			return (
				<WidgetErrorMessage
					image={<NotFoundIllustration />}
					message="Internal widget error"
					actions={[
						{
							label: 'Reload Widget',
							variant: 'primary',
							action: this.reloadWidget
						}
					]}
				>
					<p>
						Please try to reload the widget. If the problem persists, contact
						the developers. Error details:
					</p>
					<p>{error.message}</p>
				</WidgetErrorMessage>
			);
		}

		return Widget ? (
			<View
				backgroundColor="gray-200"
				width="100%"
				height="100%"
				overflow="hidden"
			>
				<Widget {...props} />
			</View>
		) : (
			<WidgetErrorMessage
				image={<NotFoundIllustration />}
				message={'Widget not found'}
			>
				<p>Please register {widget} in the widget database at:</p>
				<code>src/widgets/index.ts</code>
			</WidgetErrorMessage>
		);
	}
}
