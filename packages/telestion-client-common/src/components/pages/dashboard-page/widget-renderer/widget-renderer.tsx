/* eslint-disable react/jsx-props-no-spreading */
import { useMemo } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { WidgetDefinition } from '@wuespace/telestion-client-types';

import NotFound from '@spectrum-icons/illustrations/NotFound';

import { WidgetErrorMessage } from './widget-error-message';
import { useWidgets } from '../../../contexts/widgets-context';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<WidgetErrorMessage
			image={<NotFound />}
			message="Internal widget error"
			actions={[
				{
					label: 'Reload widget',
					variant: 'primary',
					action: resetErrorBoundary
				}
			]}
		>
			<p>
				Please try to reload the widget. If the problem persists, contact the
				developers. Error details:
			</p>
			<p>{error.message}</p>
		</WidgetErrorMessage>
	);
}

export interface WidgetRendererProps {
	widgetDefinition: WidgetDefinition;
}

export function WidgetRenderer({ widgetDefinition }: WidgetRendererProps) {
	const { widgetName, title, initialProps } = widgetDefinition;
	const widgets = useWidgets();

	const Widget = useMemo(() => {
		const available = widgets.filter(({ name }) => name === widgetName);
		return available[0] ? available[0].Widget : null;
	}, [widgetName, widgets]);

	if (Widget) {
		return (
			<ErrorBoundary FallbackComponent={ErrorFallback}>
				{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
				{/* @ts-ignore */}
				<Widget title={title} {...initialProps} />
			</ErrorBoundary>
		);
	}

	return (
		<WidgetErrorMessage image={<NotFound />} message="Widget not found">
			<p>Please register {widgetName} in the widget database at:</p>
			<code>src/widgets/index.ts</code>
		</WidgetErrorMessage>
	);
}
