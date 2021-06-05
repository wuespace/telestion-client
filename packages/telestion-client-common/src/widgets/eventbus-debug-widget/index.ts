import { Widget } from '@wuespace/telestion-client-types';
import { Widget as WidgetRenderer } from './widget';

/**
 * A widget that show's debug information about the eventbus connection.
 * It's accessible via the `'eventbusDebugWidget'` widget name.
 */
export const widget: Widget = {
	name: 'eventbusDebugWidget',
	Widget: WidgetRenderer
};
