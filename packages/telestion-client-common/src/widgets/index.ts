import { Widget } from '@wuespace/telestion-client-types';
// common widgets
import { widget as eventbusDebugWidget } from './eventbus-debug-widget';

// export all widgets at once
export const commonWidgets: Widget[] = [eventbusDebugWidget];

// re-export each widget with a unique accessor
export { eventbusDebugWidget };
