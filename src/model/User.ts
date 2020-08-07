import Dashboard from './Dashboard';

export default interface User {
	name: string;
	type: string;
	dashboards: Array<Dashboard>;
}
