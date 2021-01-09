import { useContext } from 'react';
import { widgetsContext } from '../contexts/widgets-context';

/**
 * Returns the registered widgets in the dashboard.
 *
 * @throws TypeError - if using the hook not in a dashboard component
 *
 * @example
 * ```ts
 * const widgets = useWidget();
 * ```
 */
export function useWidgets(): unknown {
	const context = useContext(widgetsContext);
	if (!context)
		throw new TypeError(
			'Widgets Context is not defined. Please provide one to continue'
		);
	return context;
}
