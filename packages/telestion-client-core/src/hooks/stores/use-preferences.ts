import create, { StoreApi, UseBoundStore } from 'zustand';
import {
	GroupSelector,
	Preference,
	PreferencesGroup,
	PreferencesStore,
	PrefSelector
} from '@wuespace/telestion-client-types';

import { isEmpty } from '../../lib/core-utils';
import { PreferencesState } from './use-preferences.model';
import { getLogger } from '../../lib';

const logger = getLogger('Preferences');

/**
 * Returns the preferences application state and actions to interact with.
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
 * @see {@link PreferencesState}
 * @see {@link https://github.com/pmndrs/zustand}
 * @see {@link UseBoundStore}
 * @see {@link zustand#shallow}
 *
 * @example
 * Fetch current preference from the store:
 * ```ts
 * // React component or hook context
 * const myGroupSelector = 'my-group';
 * const myVarSelector = 'my-var';
 * const myPreference = usePreferences(
 * 	state => state.preferences[myGroupSelector][myVarSelector]
 * );
 * ```
 *
 * Performance optimized and type-safe fetching from the store:
 * ```ts
 * import { useCallback, ReactNode } from 'react';
 * import { StateSelector } from 'zustand';
 * import shallow from 'zustand/shallow';
 * import {
 * 	usePreferences,
 * 	PreferencesState
 * } from '@wuespace/telestion-client-core';
 * import { someRenderer } from './some-renderer';
 *
 * // selector does not depend on scope, so it's better to define it outside
 * // to not re-declare it on every render
 * const selector: StateSelector<
 * 	PreferencesState,
 * 	{
 * 		setValue: PreferencesState['setValue'],
 * 		setRenderer: PreferencesState['setRenderer']
 * 	}
 * > = state => ({
 * 	setValue: state.setValue,
 * 	setRenderer: state.setRenderer
 * });
 *
 * export function MyComponent(): ReactNode {
 * 	const { setValue, setRenderer } = usePreferences(selector, shallow);
 *
 * 	const updateValue = useCallback(
 * 		() => setValue('null', 'title', 'New Application Title!'),
 * 		[]
 * 	);
 *
 * 	const updateRenderer = useCallback(
 * 		() => setRenderer('null', 'title', someRenderer),
 * 		[]
 * 	);
 *
 * 	return (
 * 		<div>
 * 			<button onClick={updateValue}>Update Value</button>
 * 			<button onClick={updateRenderer}>Update Renderer</button>
 * 		</div>
 * 	);
 * }
 * ```
 */
export const usePreferences: UseBoundStore<StoreApi<PreferencesState>> =
	create<PreferencesState>((set, get) => ({
		preferences: {},
		setValue: (group, preference, newValue) =>
			set(state => setPrefValue(state, group, preference, 'value', newValue)),
		setRenderer: (group, preference, newRenderer) =>
			set(state =>
				setPrefValue(state, group, preference, 'renderer', newRenderer)
			),
		removePreference: (group, preference) => {
			const currentStore = get().preferences;
			// group is empty -> no preference to delete, return
			if (isEmpty(currentStore[group] || {})) return;

			const newGroup: PreferencesGroup = { ...currentStore[group] };
			delete newGroup[preference];

			const newStore: PreferencesStore = { ...currentStore, [group]: newGroup };
			if (isEmpty(newGroup)) delete newStore[group];

			set({ preferences: newStore });
			logger.info(`Preference ${preference} removed from group ${group}`);
		},
		removeGroup: group => {
			const newStore = { ...get().preferences };
			delete newStore[group];
			set({ preferences: newStore });
			logger.info(`Group ${group} removed`);
		},
		setStore: newStore => {
			set({ preferences: newStore });
			logger.info('Preference store replaced');
		}
	}));

/**
 * Returns a {@link PreferencesState}, based on the `currentState`, with `[key]` set to `value` on the preference
 * `preference` in the group `group`.
 *
 * @param currentState - the current state
 * @param group - the selector of the group the preference is in.
 * @param preference - the name of the preference
 * @param key - the key of the value that gets updated. Either `'value'` or `'renderer'`
 * @param value - the new value
 *
 * @returns the new state, including the applied changes.
 *
 * @example
 * ```ts
 * setValue: (group, preference, newValue) =>
 *   set(
 *     state => setPrefValue(state, group, preference, 'value', newValue)
 *   ),
 * ```
 */
function setPrefValue(
	currentState: PreferencesState,
	group: GroupSelector,
	preference: PrefSelector,
	key: 'value' | 'renderer',
	value: any
): Pick<PreferencesState, 'preferences'> {
	logger.debug(`Update ${group}.${preference}.${key}`);
	const currentStore = currentState.preferences;
	const currentGroup = currentStore[group];

	const newPreference: Preference = {
		// check if group already defined to avoid TypeError
		...(currentGroup ? currentGroup[preference] : undefined)
	};

	newPreference[key] = value;

	const newPreferences: PreferencesStore = {
		...currentStore,
		[group]: {
			...currentStore[group],
			[preference]: newPreference
		}
	};

	return { preferences: newPreferences };
}
