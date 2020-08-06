import WidgetList from './WidgetList';

export interface DashboardStructureItem {
	Widget: keyof WidgetList;
	cols: number;
	rows: number;
}

export default interface DashboardStructure {
	name: string;
	items: Array<DashboardStructureItem>;
}
