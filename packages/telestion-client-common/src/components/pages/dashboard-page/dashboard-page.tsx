import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Routing } from '@wuespace/telestion-client-types';

import { Dashboard } from './dashboard/dashboard';
import { NoDashboardsMessage } from './no-dashboards-message';
import { useCurrentDashboards } from '../../../hooks';

/**
 * A Telestion Client page that renders a dashboard page.
 * It displays the currently active dashboard of an authenticated user.
 *
 * It can be changed with the {@link DashboardPicker} component
 * usually used in the application header.
 * To register new dashboard for the user or change existing,
 * please use the {@link useUserConfig} hook.
 *
 * It only renders if someone is authenticated.
 * Otherwise, it redirects to the login page.
 *
 * **Attention**
 *
 * If you create your own dashboard page, please pass through
 * the routing information so the pages component read it
 * and render the page the right way:
 * `MyDashboardPage.routing = TCDashboardPage.routing;`
 *
 * @see {@link DashboardPicker}
 * @see {@link useUserConfig}
 * @see {@link @wuespace/telestion-client-types#UserConfig}
 * @see {@link @wuespace/telestion-client-core#Pages}
 *
 * @example
 * ```ts
 * function App() {
 * 	return (
 * 		<TelestionClient>
 * 			<Pages>
 * 				<LoginPage />
 * 				<DashboardPage />
 * 				<NotFoundPage />
 * 			</Pages>
 * 		</TelestionClient>
 * 	);
 * }
 * ```
 */
export function DashboardPage() {
	const { id } = useParams<{ id: string }>();
	const [dashboards] = useCurrentDashboards();

	const idAsNumber = useMemo(() => Number.parseInt(id, 10), [id]);

	if (!dashboards) {
		return <NoDashboardsMessage />;
	}

	return <Dashboard dashboard={dashboards[idAsNumber]} />;
}

/**
 * The routing for the dashboard page of Telestion Client Common package.
 *
 * It only renders if someone is authenticated.
 * Otherwise, it redirects to the login page.
 */
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
