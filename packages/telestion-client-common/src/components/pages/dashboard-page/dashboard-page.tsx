import { useMemo, useState } from 'react';
import { StateSelector } from 'zustand';
import { useParams } from 'react-router-dom';
import { EventBusState, useEventBus } from '@wuespace/telestion-client-core';
import { Routing } from '@wuespace/telestion-client-types';

import { useCurrentDashboards } from '../../../hooks';
import { Dashboard } from './dashboard/dashboard';
import { NoDashboardsMessage } from './no-dashboards-message';
import { MissingEventBus } from './missing-event-bus';
import { ClipboardContent, ClipboardContext } from './props-clipboard';

// eventbus selector
const selector: StateSelector<EventBusState, EventBusState['eventBus']> =
	state => state.eventBus;


/**
 * A Telestion Client page that renders a dashboard page.
 * It displays the currently active dashboard of an authenticated user.
 *
 * It can be changed with the {@link DashboardPicker} component
 * usually used in the application header.
 * To register a new dashboard for the user or change existing,
 * use the {@link useUserConfig} hook.
 *
 * It only renders if someone is authenticated.
 * Otherwise, it redirects to the login page.
 *
 * **Attention**
 *
 * If you create your own dashboard page, please pass
 * the routing information so that the pages component read it
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
	const clipState = useState<ClipboardContent>();

	const { id } = useParams<{ id: string }>();
	const eventBus = useEventBus(selector);
	const [dashboards] = useCurrentDashboards();

	const idAsNumber = useMemo(() => Number.parseInt(id, 10), [id]);

	if (!eventBus) {
		return <MissingEventBus />;
	}

	if (!dashboards) {
		return <NoDashboardsMessage />;
	}

	return (
		<ClipboardContext.Provider value={clipState}>
			<Dashboard dashboard={dashboards[idAsNumber]} />
		</ClipboardContext.Provider>
	);
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
