/* eslint-disable @typescript-eslint/ban-ts-comment,react/jsx-props-no-spreading */
import { ErrorBoundary } from 'react-error-boundary';
import { Widget, WidgetDefinition } from '@wuespace/telestion-client-types';

import { useBooleanState, useStoredState } from './hooks';
import { ErrorFallback } from './error-fallback';
import { ConfigRenderer } from './config-renderer';

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
	 * The {@link @wuespace/telestion-client-types#WidgetDefinition}
	 * rendered by the {@link WidgetSelector}.
	 */
	definition: WidgetDefinition;

	/**
	 * The actual widget which contains the components and settings.
	 */
	widget: Widget;
}

/**
 * Renders the given widget with the help of the widget definition.
 *
 * The component surrounds the widget with an error boundary
 * to catch potential bugs and errors in the widgets.
 * Therefore, errors within the widget don't break the entire application,
 * but only the widget renderer itself.
 * If an error occurs, the fallback widget gets rendered
 * with an option to reload the widget and "try again".
 *
 * @see {@link WidgetRendererProps}
 * @see {@link WidgetSelector}
 *
 * @example
 * ```tsx
 * function WidgetSelector() {
 * 	const widgets = useWidgets();
 * 	const widget = widgets.filter(advancedFilter)[0];
 *
 * 	if (widget) {
 * 		return <WidgetRenderer definition={definition} widget={widget} />;
 * 	}
 *
 * 	return <WidgetErrorMessage />;
 * }
 * ```
 */
export function WidgetRenderer({ definition, widget }: WidgetRendererProps) {
	// extract important information
	const { id, initialProps } = definition;
	const { version, Widget: Content } = widget;
	// build up state
	const [inConfig, open, close] = useBooleanState();
	const propsState = useStoredState(`${id}-${version}`, initialProps || {});

	return (
		<ErrorBoundary FallbackComponent={ErrorFallback} onReset={close}>
			{inConfig ? (
				<ConfigRenderer
					widget={widget}
					id={id}
					propsState={propsState}
					onClose={close}
				/>
			) : (
				// @ts-ignore
				<Content {...propsState[0]} />
			)}
		</ErrorBoundary>
	);
}
