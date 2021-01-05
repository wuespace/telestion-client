import { FunctionComponent } from 'react';
import { ConfigurableWidgetProps } from './configurable-widget-props';
import { WidgetProps } from './widget-props';
import { ConfigControlsProps } from './config-controls-props';

export interface Widget<
	P extends ConfigurableWidgetProps = ConfigurableWidgetProps
> {
	name: string;
	WidgetFC: FunctionComponent<WidgetProps<P>>;
	ConfigControlsFC: FunctionComponent<ConfigControlsProps<P>>;
}
