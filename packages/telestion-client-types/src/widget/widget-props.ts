// define here types that are always available in the widget
// and NOT changeable via the config controls
import { ConfigurableWidgetProps } from './configurable-widget-props';

export type WidgetProps<
	P extends ConfigurableWidgetProps = ConfigurableWidgetProps
> = P & {
	title: string;
};
