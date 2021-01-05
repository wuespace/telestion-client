// define here types that are always must to be met by the widget creator

import { JsonSerializable } from '../json-serializable';

export type ConfigurableWidgetProps = {
	[key: string]: JsonSerializable;
};
