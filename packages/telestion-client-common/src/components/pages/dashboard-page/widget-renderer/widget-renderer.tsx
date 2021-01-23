import { WidgetDefinition } from '@wuespace/telestion-client-types';

export interface WidgetRendererProps {
	widget: WidgetDefinition;
}

export function WidgetRenderer({ widget }: WidgetRendererProps) {
	return <div>Widget {widget.title}</div>;
}
