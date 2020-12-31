import { JsonSerializable } from '../json-serializable';

// define here types that are always must to be met by the widget creator
export type ConfigurableWidgetProps = {
	[key: string]: JsonSerializable;
};
