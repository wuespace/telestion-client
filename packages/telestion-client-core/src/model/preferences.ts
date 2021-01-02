import { ReactNode } from 'react';

export type JsonSerializable =
	| number
	| string
	| boolean
	| Map<string, JsonSerializable>
	| Array<JsonSerializable>;

/**
 * the default type of a preference value
 */
export type PrefValue = JsonSerializable;

/**
 * Renders a React node that displays and changes the given preference
 * in a proper way.
 *
 * @typeParam T the type of the preference (defaults to {@link JsonSerializable})
 */
export type PrefRenderer<T extends PrefValue = PrefValue> =
	/**
	 * @param value to current value of the preference
	 * @param setValue updates the value of the preference to `newValue`
	 */
	(value: T, setValue: (newValue: T) => void) => ReactNode;

/**
 * the "name" of a group or preference
 */
export type Selector = string;

export type PrefSelector = Selector;

export type GroupSelector = Selector | null;

/**
 * a preference with value and renderer
 *
 * @typeParam T the type of the preference (defaults to {@link JsonSerializable})
 */
export interface Preference<T extends PrefValue = PrefValue> {
	/**
	 * the current value of the preference
	 */
	value?: T;
	/**
	 * an update component which displays and changes the preference value
	 * in a proper way
	 */
	renderer?: PrefRenderer<T>;
}

/**
 * a group of preferences where every preference is accessible via a selector
 */
export type PreferencesGroup = Record<PrefSelector, Preference>;

/**
 * the entire store of grouped preferences also accessible via a selector
 *
 * The group `null` has a special meaning.
 * It is the group for global preferences
 * which do not have a group they belong to.
 */
export type PreferencesStore = Record<GroupSelector, PreferencesGroup>;
