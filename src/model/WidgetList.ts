import { FunctionComponent } from 'react';

export default interface WidgetList {
	// TODO: Specify props for Widget nodes
	[key: string]: FunctionComponent;
}
