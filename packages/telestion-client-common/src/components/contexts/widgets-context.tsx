import { createContext, ReactElement, useContext } from 'react';
import PropTypes from 'prop-types';
import { Widget } from '@wuespace/telestion-client-types';
import { widgetPropType } from '@wuespace/telestion-client-prop-types';

// React context for the registered widgets in the application
const widgetsContext = createContext<Array<Widget> | null>(null);

/**
 * React Props of {@link WidgetsContext}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link WidgetsContext}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface WidgetsContextProps {
	/**
	 * Optional widgets that are registered in the widgets context
	 * and retrievable via the {@link useWidgets} hook.
	 */
	widgets?: Array<Widget>;

	/**
	 * The children components which have access to the registered widget
	 * via the {@link useLogo} hook.
	 */
	children: ReactElement | Array<ReactElement>;
}

/**
 * Wraps its children into the widgets context
 * which stores the registered widgets of the application
 * and these are accessible via the {@link useWidgets} hook.
 *
 * @see {@link useWidgets}
 * @see {@link WidgetsContextProps}
 *
 * @example
 * ```ts
 * interface Props {
 * 	widgets?: Array<Widget>;
 * 	children: ReactElement | Array<ReactElement>;
 * }
 *
 * function MyWrapper({ widgets, children }: Props) {
 * 	return (
 * 		<WidgetsContext widgets={widgets}>
 * 			{children}
 * 		</WidgetsContext>
 * 	);
 * }
 * ```
 */
export function WidgetsContext({ widgets, children }: WidgetsContextProps) {
	return (
		<widgetsContext.Provider value={widgets ?? []}>
			{children}
		</widgetsContext.Provider>
	);
}

WidgetsContext.propTypes = {
	widgets: PropTypes.arrayOf(widgetPropType),
	children: PropTypes.node.isRequired
};

/**
 * Returns a list of all registered widgets in the application.
 * @throws TypeError - if called outside of the {@link CommonWrapper}
 *
 * @see {@link WidgetsContext}
 * @see {@link CommonWrapper}
 *
 * @example
 * ```ts
 * function RegisteredWidgets() {
 * 	const widgets = useWidgets();
 * 	const names = widgets.map(widget => widget.name);
 *
 * 	return (
 * 		<ul>
 * 			{names.map(name => <li>{name}</li>)}
 * 		</ul>
 * 	);
 * }
 * ```
 */
export function useWidgets(): Array<Widget> {
	const widgets = useContext(widgetsContext);
	if (!widgets) {
		throw new TypeError(
			'Not in an widget context. Please provide one to continue.'
		);
	}
	return widgets;
}
