import { Dispatch, SetStateAction, useCallback } from 'react';
import { StateSelector } from 'zustand';
import { Dashboard, Username } from '@wuespace/telestion-client-types';

import { UserConfigState, useUserConfig } from '../stores';

// static user config selector
const updateSelector: StateSelector<
	UserConfigState,
	UserConfigState['updateUserInfo']
> = state => state.updateUserInfo;

/**
 * Gets and sets the current dashboards for a specific user.
 *
 * If the user does not exist in the user config store
 * the returned dashboards are `undefined`.
 *
 * The update function is stable as long as the username not changes.
 *
 * _Usage and behaviour inspired from the React `useState` hook._
 *
 * @param username - the username of the dashboards to obtain
 * @returns a tuple of the current dashboards
 * and a setter function to update the dashboards for the current user.
 *
 * @see {@link useUserConfig}
 * @see {@link @wuespace/telestion-client-types#Dashboard}
 * @see {@link react#useState}
 *
 * @example
 * Get and set dashboards for specific user
 * ```ts
 * function MyComponent() {
 * 	const [dashboards, setDashboards] = useDashboards('Alice');
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
export function useDashboards(
	username: Username
): [Array<Dashboard>, Dispatch<SetStateAction<Array<Dashboard>>>] {
	// never updates again
	const update = useUserConfig(updateSelector);
	// updates only on changed dashboards and changed username
	const dashboards = useUserConfig(
		useCallback(state => state.userConfig[username].dashboards, [username])
	);

	// updates only on username change -> almost stable function
	const setDashboards = useCallback(
		(newState: SetStateAction<Array<Dashboard>>) => {
			update(
				username,
				typeof newState === 'function'
					? prevState => ({
							dashboards: newState(prevState.dashboards)
					  })
					: { dashboards: newState }
			);
		},
		[update, username]
	);

	return [dashboards, setDashboards];
}
