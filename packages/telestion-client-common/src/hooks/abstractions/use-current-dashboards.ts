import { StateSelector } from 'zustand';
import { Dashboard } from '@wuespace/telestion-client-types';
import { AuthState, useAuth } from '@wuespace/telestion-client-core';

import { DispatchDashboards, useDashboards } from './use-dashboards';

// auth selector
const selector: StateSelector<AuthState, AuthState['auth']> = state =>
	state.auth;

/**
 * Gets and sets the current dashboards for the current authenticated user.
 *
 * If no user is authenticated the returned dashboards are `undefined`.
 *
 * The update function is stable as long
 * as the authenticated user does not change.
 *
 * _Usage and behaviour inspired from the React `useState` hook._
 *
 * @returns a tuple of the current dashboards
 * and a setter function to update the dashboards for the current user.
 *
 * @see {@link useUserConfig}
 * @see {@link @wuespace/telestion-client-types#Dashboard}
 * @see {@link react#useState}
 *
 * @example
 * Get and set dashboards for an authenticated user
 * ```ts
 * function MyComponent() {
 * 	const [dashboards, setDashboards] = useCurrentDashboards();
 *
 *  return (
 *  	<div>
 *  		<RenderDashboards dashboards={dashboards} />
 *  		<button onClick={() => setDashboards([])}>
 *  			Clear dashboards
 *  		</button>
 *  	</div>
 *  );
 * }
 * ```
 */
export function useCurrentDashboards(): [
	Array<Dashboard> | undefined,
	DispatchDashboards
] {
	const auth = useAuth(selector);
	// The username '' actually never exists
	// so use it to generate undefined dashboards.
	return useDashboards(auth ? auth.username : '');
}
