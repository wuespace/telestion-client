import DashboardStructure from './DashboardStructure';

export default interface User {
	name: string;
	dashboardStructures: Array<DashboardStructure>;
}
