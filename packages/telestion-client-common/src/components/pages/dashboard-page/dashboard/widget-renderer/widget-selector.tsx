/* eslint-disable react/jsx-props-no-spreading */
import { useMemo } from 'react';
import { WidgetDefinition } from '@wuespace/telestion-client-types';

import NotFound from '@spectrum-icons/illustrations/NotFound';

import { useWidgets } from '../../../../contexts/widgets-context';
import { WidgetErrorMessage } from './widget-error-message';
import { WidgetRenderer } from './widget-renderer';

/**
 * React Props of {@link WidgetSelector}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link WidgetSelector}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface WidgetSelectorProps {
	/**
	 * The {@link @wuespace/telestion-client-types#WidgetDefinition} rendered by the {@link WidgetSelector}.
	 */
	definition: WidgetDefinition;
}

/**
 * The widget selector component.
 * It searches for the widget in the registered application widgets.
 * When it found one, it gives the information to the Widget renderer component.
 *
 * If the component can't find the widget,
 * it shows a widget error message that tells the user
 * that the widget with this specified name does not exist
 * in the widget database.
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
 * 	return <WidgetSelector widgetDefinition={widget} />;
 * }
 * ```
 */
export function WidgetSelector({ definition }: WidgetSelectorProps) {
	const { widgetName } = definition;
	const widgets = useWidgets();

	const widget = useMemo(() => {
		const available = widgets.filter(({ name }) => name === widgetName);
		return available[0] || null;
	}, [widgetName, widgets]);

	if (widget) {
		return <WidgetRenderer definition={definition} widget={widget} />;
	}

	return (
		<WidgetErrorMessage image={<NotFound />} message="Widget not found">
			<p>Please register {widgetName} in the widget database at:</p>
			<code>src/widgets/index.ts</code>
		</WidgetErrorMessage>
	);
}
