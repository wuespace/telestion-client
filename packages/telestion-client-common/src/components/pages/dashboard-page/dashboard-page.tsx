import { Routing } from '@wuespace/telestion-client-types';
import { Dashboard } from './dashboard';

export function DashboardPage() {
	return <Dashboard />;
}

const routing: Routing = {
	type: 'auth',
	path: '/dashboard/:id',
	exact: false,
	redirectPath: '/login',
	additionalRedirects: [
		{
			path: '/dashboard',
			exact: false,
			redirectPath: '/dashboard/0',
			last: false
		}
	]
};

DashboardPage.routing = routing;
