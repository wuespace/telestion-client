import { useContext } from 'react';
import { widgetsContext } from '../contexts/widgets-context';

export function useWidgets() {
	const context = useContext(widgetsContext);
	if (!context)
		throw new TypeError(
			'Widgets Context is not defined. Please provide one to continue'
		);
	return context;
}
