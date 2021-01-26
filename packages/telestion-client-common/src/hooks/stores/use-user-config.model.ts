import { State } from 'zustand';
import {
	UserConfig,
	UserInformation,
	Username
} from '@wuespace/telestion-client-types';
import { SetPartialStateAction } from '../../lib';

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
