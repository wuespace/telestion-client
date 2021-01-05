import { createContext, ReactNode } from 'react';
// import PropTypes from 'prop-types';
import { Widget } from '../../../../model/widget/widget';

export const widgetsContext = createContext<Widget[] | null>(null);

export interface WidgetsProviderProps {
	widgets: Widget[];

	children: ReactNode;
}

export const WidgetsProvider = ({
	widgets,
	children
}: WidgetsProviderProps) => (
	<widgetsContext.Provider value={widgets}>{children}</widgetsContext.Provider>
);

// WidgetsProvider.propTypes = {
// 	widgets: PropTypes.
// };
