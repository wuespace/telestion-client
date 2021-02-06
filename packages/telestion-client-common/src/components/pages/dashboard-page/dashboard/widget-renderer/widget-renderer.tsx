/* eslint-disable react/jsx-props-no-spreading */
import { useMemo } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { WidgetDefinition } from '@wuespace/telestion-client-types';

import NotFound from '@spectrum-icons/illustrations/NotFound';

import { WidgetErrorMessage } from './widget-error-message';
import { useWidgets } from '../../../../contexts/widgets-context';

/**
 * Special component that renders when an error occurs inside a widget.
 * The component generates a widget error message and allows the user to reload the widget.
 *
 * It has a predefined structure based on the react-error-boundary package.
 *
 * @see {@link WidgetErrorMessage}
 * @see {@link react-error-boundary#ErrorBoundary}
 *
 * @example
 * ```ts
 * function MyErrorBoundary() {
 * 	return (
 * 		<ErrorBoundary FallbackComponent={ErrorFallback}>
 * 			<ICanFail />
 * 		</ErrorBoundary>
 * 	);
 * }
 * ```
 */
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

/**
 * React Props of {@link WidgetRenderer}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link WidgetRenderer}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface WidgetRendererProps {
	/**
	 * The {@link @wuespace/telestion-client-types#WidgetDefinition} rendered by the {@link WidgetRenderer}.
	 */
	widgetDefinition: WidgetDefinition;
}

/**
 * The main widget renderer component.
 * It searches for the widget in the registered application widgets
 * and renders it.
 * If the component can't find the widget, it shows a widget error message that tells the user
 * that the widget with this specified name does not exist in the widget database.
 *
 * If the widget exists, the widget renderer displays it and surrounds it
 * with an error boundary to catch potential bugs and errors in the widgets.
 * Therefore, errors within the widget don't break the entire application,
 * but only the widget renderer itself.
 * If an error occurs, the fallback widget gets rendered
 * with an option to reload the widget and "try again".
 *
 * You can register new widgets in the {@link CommonWrapper} component.
 *
 * @see {@link WidgetRendererProps}
 * @see {@link ErrorFallback}
 * @see {@link WidgetErrorMessage}
 * @see {@link CommonWrapper}
 *
 * @example
 * ```ts
 * function MyWidgetRenderer() {
 * 	const widget: WidgetDefinition = {...};
 * 	return <WidgetRenderer widgetDefinition={widget} />;
 * }
 * ```
 */
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
