import { FunctionComponent } from 'react';
import WidgetProps from './WidgetProps';

export default interface WidgetList {
	// TODO: Specify props for Widget nodes
	[key: string]: FunctionComponent<WidgetProps>;
}
