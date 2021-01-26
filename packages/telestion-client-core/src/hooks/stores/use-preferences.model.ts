import { State } from 'zustand';
import {
	GroupSelector,
	PreferencesStore,
	PrefRenderer,
	PrefSelector,
	PrefValue
} from '@wuespace/telestion-client-types';

/**
 * The preference state and actions of the Telestion Client Core.
 *
 * Defines the preferences store and functions to change the store.
 *
 * @see {@link PreferencesState.preferences}
 * @see {@link PreferencesState.setValue}
 */
export interface PreferencesState extends State {
	/**
	 * Stores the registered preferences as groups of selector-value pair.
	 *
	 * To add, update and remove the preference value use {@link setValue}.
	 *
	 * To add, update and remove the preference renderer
	 * use {@link setRenderer} instead.
	 *
	 * @see {@link PreferencesState.setValue}
	 * @see {@link PreferencesState.setRenderer}
	 *
	 * @example
	 * ```ts
	 * const preference = usePreferences(
	 *    state => state.preferences['group']['preference'].value
	 * );
	 *
	 * return <div>{preferences}</div>;
	 * ```
	 */
	preferences: PreferencesStore;

	/**
	 * Adds, updates or removes a preference value from the preference store.
	 *
	 * To access the preference a group and a preference selector is needed.
	 *
	 * If the group selector is `null`
	 * the preference in the global scope will be used.
	 *
	 * @param group - the group of the preference
	 * @param preference - the preference name
	 * @param newValue - the new value of the preference
	 *
	 * @see {@link PreferencesState.preferences}
	 * @see {@link PrefValue}
	 * @see {@link PreferencesState.setRenderer}
	 * @see {@link PreferencesState.removePreference}
	 *
	 * @example
	 * ```ts
	 * const update = usePreferences(state => state.updateValue);
	 * const handleClick = () => update('group', 'preference', 'My new value!');
	 *
	 * return <button onClick={handleClick}>Set Preference</button>;
	 * ```
	 */
	setValue: (
		group: GroupSelector,
		preference: PrefSelector,
		newValue: PrefValue
	) => void;

	/**
	 * Adds, updates or removes a preference renderer from the preference store.
	 *
	 * To access the preference a group and a preference selector is needed.
	 *
	 * If the group selector is `null`
	 * the preference in the global scope will be used.
	 *
	 * @param group - the group of the preference
	 * @param preference - the preference name
	 * @param newRenderer - the new renderer for the preference
	 *
	 * @see {@link PreferencesState.preferences}
	 * @see {@link PrefRenderer}
	 * @see {@link PreferencesState.setValue}
	 *
	 * @example
	 * ```ts
	 * const update = usePreferences(state => state.updateValue);
	 * const renderer = (value, setValue) => (
	 *    <TextInput initialValue={value} onSubmit={setValue} />
	 * );
	 *
	 * const handleClick = () => update('group', 'preference', renderer);
	 *
	 * return <button onClick={handleClick}>Set Renderer</button>;
	 * ```
	 */
	setRenderer: (
		group: GroupSelector,
		preference: PrefSelector,
		newRenderer: PrefRenderer
	) => void;

	/**
	 * Removes a preference from the store.
	 *
	 * To access the preference a group and a preference selector is needed.
	 *
	 * If the group selector is `null`
	 * the preference in the global scope will be used.
	 *
	 * @param group - the group of the preference
	 * @param preference - the name of the preference that will be removed
	 *
	 * @see {@link PreferencesState.setValue}
	 * @see {@link PreferencesState.removeGroup}
	 */
	removePreference: (group: GroupSelector, preference: PrefSelector) => void;

	/**
	 * Removes an entire group of preferences from the store.
	 *
	 * To access the group and a selector is needed.
	 *
	 * If the group selector is `null`
	 * the preference in the global scope will be used.
	 *
	 * @param group - the name of the group that will be removed
	 *
	 * @see {@link PreferencesState.removePreference}
	 * @see {@link PreferencesState.setValue}
	 */
	removeGroup: (group: GroupSelector) => void;

	/**
	 * Overwrites the current preferences store with the specified store.
	 * @param newStore - the new preferences store to use
	 *
	 * @see {@link PreferencesStore}
	 * @see {@link PreferencesState.preferences}
	 */
	setStore: (newStore: PreferencesStore) => void;
}
