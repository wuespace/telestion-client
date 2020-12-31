import { createContext, FC } from 'react';
import { Widget } from '../../../../model/widget/widget';

export const widgetsContext = createContext<Widget[]>(null);

export interface WidgetsProviderProps {
	widgets: Widget[];
}

export const WidgetsProvider: FC<WidgetsProviderProps> = ({ widgets, children }) => (
	<widgetsContext.Provider value={widgets}>
		{children}
	</widgetsContext.Provider>
);
