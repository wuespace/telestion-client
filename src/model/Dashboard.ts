import WidgetList from './WidgetList';
import WidgetProps from './WidgetProps';

export interface DashboardItem {
	widget: keyof WidgetList;
	cols: number;
	rows: number;
	props: WidgetProps;
}

export default interface Dashboard {
	name: string;
	items: Array<DashboardItem>;
}
