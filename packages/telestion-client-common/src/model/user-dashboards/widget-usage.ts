import { ConfigurableWidgetProps } from '../widget/configurable-widget-props';

export interface WidgetUsage {
	width: number;
	height: number;
	widgetName: string;
	title: string;
	initialProps: ConfigurableWidgetProps;
}
