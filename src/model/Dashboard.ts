import WidgetList from './WidgetList';

export interface DashboardItem {
	widget: keyof WidgetList;
	cols: number;
	rows: number;
}

export default interface Dashboard {
	name: string;
	items: Array<DashboardItem>;
}
