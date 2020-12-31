import { ConfigurableWidgetProps } from './configurable-widget-props';

export interface ConfigControlsProps<P extends ConfigurableWidgetProps = {}> {
	currentProps: P;
	onUpdate: (newProps: Partial<P>) => void;
}
