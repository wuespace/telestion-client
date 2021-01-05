import create from 'zustand';
import {
	PreferencesStore,
	GroupSelector,
	PrefSelector,
	PrefValue,
	PrefRenderer,
	Preference,
	PreferencesGroup
} from '../model/preferences';
import { isEmpty } from '../lib/is-empty';

export type PreferenceState = {
	/**
	 * Stores the registered preferences as groups of selector-value pair.
	 *
	 * To add, update and remove the preference value use {@link setValue}.
	 *
	 * To add, update and remove the preference renderer
	 * use {@link setRenderer} instead.
	 *
	 * @example ```ts
	 * const preference = usePreferences(
	 *   state => state.preferences['group']['preference'].value
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
	 * @param group the group of the preference
	 * @param preference the preference name
	 * @param newValue the new value of the preference
	 *
	 * @example ```ts
	 * const update = usePreferences(state => state.updateValue);
	 * const handleClick = () => update('group', 'preference', 'My new value!');
	 *
	 * return <button onClick={handleClick}>Set Preference</button>;
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
	 * @param group the group of the preference
	 * @param preference the preference name
	 * @param newRenderer the new renderer for the preference
	 *
	 * @example ```ts
	 * const update = usePreferences(state => state.updateValue);
	 * const renderer = (value, setValue) => (
	 *   <TextInput initialValue={value} onSubmit={setValue} />
	 * );
	 *
	 * const handleClick = () => update('group', 'preference', renderer);
	 *
	 * return <button onClick={handleClick}>Set Renderer</button>;
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
	 * @param group the group of the preference
	 * @param preference the name of the preference that will be removed
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
	 * @param group the name of the group that will be removed
	 */
	removeGroup: (group: GroupSelector) => void;

	/**
	 * Overwrites the current preferences store with the specified store.
	 * @param newStore the new preferences store to use
	 */
	setStore: (newStore: PreferencesStore) => void;
};

export const usePreferences = create<PreferenceState>((set, get) => ({
	preferences: {},
	setValue: (group, preference, newValue) => {
		const currentStore = get().preferences;
		const currentGroup = currentStore[group];

		const newPreference: Preference = {
			// check if group already defined to avoid TypeError
			...(currentGroup ? currentGroup[preference] : undefined),
			value: newValue
		};

		const newStore: PreferencesStore = {
			...currentStore,
			[group]: {
				...currentStore[group],
				[preference]: newPreference
			}
		};

		set({ preferences: newStore });
	},
	setRenderer: (group, preference, newRenderer) => {
		const currentStore = get().preferences;
		const currentGroup = currentStore[group];

		const newPreference: Preference = {
			// check if group already defined to avoid TypeError
			...(currentGroup ? currentGroup[preference] : undefined),
			renderer: newRenderer
		};

		const newPreferences: PreferencesStore = {
			...currentStore,
			[group]: {
				...currentStore[group],
				[preference]: newPreference
			}
		};

		set({ preferences: newPreferences });
	},
	removePreference: (group, preference) => {
		const currentStore = get().preferences;
		// group is empty -> no preference to delete, return
		if (isEmpty(currentStore[group] || {})) return;

		const newGroup: PreferencesGroup = { ...currentStore[group] };
		delete newGroup[preference];

		const newStore: PreferencesStore = { ...currentStore, [group]: newGroup };
		if (isEmpty(newGroup)) delete newStore[group];

		set({ preferences: newStore });
	},
	removeGroup: group => {
		const newStore = { ...get().preferences };
		delete newStore[group];
		set({ preferences: newStore });
	},
	setStore: newStore => {
		set({ preferences: newStore });
	}
}));
