import { createContext, ReactElement, useContext } from 'react';
import PropTypes from 'prop-types';
import { Widget } from '@wuespace/telestion-client-types';
import { widgetPropType } from '@wuespace/telestion-client-prop-types';

const widgetsContext = createContext<Array<Widget> | null>(null);

export interface WidgetsContextProps {
	widgets?: Array<Widget>;

	children: ReactElement | Array<ReactElement>;
}

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

export function useWidgets(): Array<Widget> {
	const widgets = useContext(widgetsContext);
	if (!widgets) {
		throw new TypeError(
			'Not in an widget context. Please provide one to continue.'
		);
	}
	return widgets;
}
