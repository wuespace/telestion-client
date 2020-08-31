import { FunctionComponent } from 'react';
import WidgetProps from './WidgetProps';

export default interface WidgetList {
	[key: string]: FunctionComponent<WidgetProps>;
}
