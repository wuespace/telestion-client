import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Routing } from '@wuespace/telestion-client-types';

import { Dashboard } from './dashboard/dashboard';
import { NoDashboardsMessage } from './no-dashboards-message';
import { useCurrentDashboards } from '../../../hooks';

export function DashboardPage() {
	const { id } = useParams<{ id: string }>();
	const [dashboards] = useCurrentDashboards();

	const idAsNumber = useMemo(() => Number.parseInt(id, 10), [id]);

	if (!dashboards) {
		return <NoDashboardsMessage />;
	}

	return <Dashboard dashboard={dashboards[idAsNumber]} />;
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
