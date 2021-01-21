import create, { State, UseStore } from 'zustand';
import {
	UserConfig,
	UserInformation,
	Username
} from '@wuespace/telestion-client-types';
import { SetPartialStateAction } from '../../lib';

const initialUserConfig: UserConfig = {};

/**
 * The user configs store and actions of Telestion Client Common.
 *
 * Stores and handles user configurations.
 *
 * @see {@link UserConfigState.userConfig}
 * @see {@link UserConfigState.updateUserInfo}
 * @see {@link @wuespace/telestion-client-types#UserConfig}
 */
export interface UserConfigState extends State {
	/**
	 * The current user config for the application.
	 * It stores the user information associated to the username.
	 *
	 * @see {@link @wuespace/telestion-client-types#UserConfig}
	 *
	 * @example
	 * Get user information for one user
	 * ```ts
	 * const infos = useUserConfig(state => state.userConfig['Alice']);
	 *
	 * console.log(infos.dashboards);
	 * ```
	 */
	userConfig: UserConfig;

	/**
	 * Adds a user to the user config store.
	 * @param username - the username of the user
	 * @param information - some additional information linked to the username
	 *
	 * @throws TypeError - if the username is not valid
	 * @throws TypeError - if the username already exists in the store
	 *
	 * @see {@link UserConfigState.userConfig}
	 * @see {@link @wuespace/telestion-client-types#UserInformation}
	 */
	addUser: (username: Username, information: UserInformation) => void;

	/**
	 * Deletes a user from the user config store.
	 * @param username - the username of the information to delete
	 *
	 * @throws TypeError - if the username does not exists in the store
	 */
	removeUser: (username: Username) => void;

	/**
	 * Updates the user information for a username.
	 * @param username - the username of the information to update
	 * @param newState - the new information for the username
	 *
	 * @throws TypeError - if the username does not exists in the store
	 */
	updateUserInfo: (
		username: Username,
		newState: SetPartialStateAction<UserInformation>
	) => void;

	/**
	 * Replaces the current user config store with the given one.
	 * @param userConfig - the new user config store
	 *
	 * @see {@link @wuespace/telestion-client-types#UserConfig}
	 */
	set: (userConfig: UserConfig) => void;

	/**
	 * Clears the entire user config store and deletes every user configuration.
	 */
	clear: () => void;
}

/**
 * Returns the user config state and actions to interact with.
 * A selector can be defined to pick out parts of the store.
 * If correctly set up, the function only triggers a rerender
 * if the selected values have changed.
 *
 * For more information about state management in Zustand,
 * take a look at their {@link https://github.com/pmndrs/zustand | GitHub page}.
 *
 * @param selector - optional selector function
 * which picks the specified elements out of the store
 * @param equalityFn - optional equality function
 * to check for state updates on the picked elements
 * @returns the picked elements in the selector function
 *
 * @see {@link UserConfigState}
 * @see {@link https://github.com/pmndrs/zustand}
 * @see {@link UseStore}
 * @see {@link zustand#shallow}
 *
 * @example
 * Fetch available usernames from the store:
 * ```ts
 * function Notifications() {
 * 	const usernames = useUserConfig(state => Object.keys(state.userConfig));
 *
 * 	return (
 * 		<ul>
 * 			{notifications.map(notification => (
 * 				<li>{notification}</li>
 * 			)}
 * 		</ul>
 * 	);
 * }
 * ```
 *
 * Performance optimized and type-safe fetching from the store:
 * ```ts
 * import { useCallback, ReactNode } from 'react';
 * import { StateSelector } from 'zustand';
 * import shallow from 'zustand/shallow';
 * import {
 * 	useUserConfig,
 * 	UserConfigState
 * } from '@wuespace/telestion-client-common';
 *
 * // selector does not depend on scope, so it's better to define it outside
 * // to not re-declare it on every render
 * const selector: StateSelector<
 * 	UserConfigState,
 * 	{
 * 		add: UserConfigState['addUser'],
 * 		remove: UserConfigState['removeUser']
 * 	}
 * > = state => ({
 * 	add: state.addUser,
 * 	remove: state.removeUser
 * });
 *
 * function MyComponent() {
 * 	const { add, remove } = useUserConfig(selector, shallow);
 *
 * 	return (
 * 		<div>
 * 			<button onClick={() => add('Alice', { dashboards: [] })}>
 * 				Add user 'Alice' to the user configurations
 * 			</button>
 * 			<button onClick={() => remove('Alice')}>
 * 				Remove user 'Alice' from the user configurations
 * 			</button>
 * 		</div>
 * 	);
 * }
 * ```
 */
export const useUserConfig: UseStore<UserConfigState> = create<UserConfigState>(
	(set, get) => ({
		userConfig: initialUserConfig,
		addUser: (username, information) => {
			if (!username) {
				throw new TypeError("The string '' is not a valid username.");
			}
			const { userConfig } = get();
			if (userConfig[username]) {
				throw new TypeError(
					`The username '${username}' already exists in the user config store. ` +
						'Please edit the user information ' +
						'or delete the user from the store to create a one.'
				);
			}
			set({ userConfig: { ...userConfig, [username]: information } });
		},
		removeUser: username => {
			const { userConfig } = get();
			if (!userConfig[username]) {
				throw new TypeError(
					`The username '${username}' does not exist in the user config store.`
				);
			}
			const newUserConfig = { ...userConfig };
			delete newUserConfig[username];
			set({ userConfig: newUserConfig });
		},
		updateUserInfo: (username, newState) => {
			const { userConfig } = get();
			if (!userConfig[username]) {
				throw new TypeError(
					`The username '${username}' does not exist in the user config store.`
				);
			}
			let newUserInfo: Partial<UserInformation>;
			if (typeof newState === 'function') {
				newUserInfo = newState(userConfig[username]);
			} else {
				newUserInfo = newState;
			}
			set({
				userConfig: {
					...userConfig,
					[username]: { ...userConfig[username], ...newUserInfo }
				}
			});
		},
		set: userConfig => set({ userConfig }),
		clear: () => set({ userConfig: initialUserConfig })
	})
);
