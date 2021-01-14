import { ReactNode } from 'react';
import { JsonSerializable } from './json-serializable';

/**
 * the default type of a preference value
 */
export type PrefValue = JsonSerializable;

/**
 * Renders a React node that displays and changes the given preference
 * in a proper way.
 *
 * @typeParam T - the type of the preference
 * (defaults to {@link JsonSerializable})
 *
 * @see {@link JsonSerializable}
 */
export type PrefRenderer<T extends PrefValue = PrefValue> =
	/**
	 * @param value - to current value of the preference
	 * @param setValue - updates the value of the preference to `newValue`
	 */
	(value: T, setValue: (newValue: T) => void) => ReactNode;

/**
 * the "name" of a group or preference
 *
 * @see {@link PrefSelector}
 * @see {@link GroupSelector}
 */
export type Selector = string;

/**
 * the type of a selector to select a preference out of a preference group
 *
 * @see {@link Preference}
 * @see {@link PreferencesGroup}
 * @see {@link Selector}
 */
export type PrefSelector = Selector;

/**
 * the type of a selector to select a group out of a preference store
 *
 * @see {@link PreferencesGroup}
 * @see {@link PreferencesStore}
 * @see {@link Selector}
 */
export type GroupSelector = Selector | 'null';

/**
 * a preference with value and renderer
 *
 * @typeParam T - the type of the preference
 * (defaults to {@link PrefValue})
 *
 * @see {@link PrefRenderer}
 * @see {@link PreferencesStore}
 * @see {@link PrefValue}
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
 *
 * @see {@link PrefSelector}
 * @see {@link GroupSelector}
 */
export type PreferencesGroup = Record<PrefSelector, Preference>;

/**
 * the entire store of grouped preferences also accessible via a selector
 *
 * The group `null` has a special meaning.
 * It is the group for global preferences
 * which do not have a group they belong to.
 *
 * @see {@link PreferencesGroup}
 * @see {@link GroupSelector}
 * @see {@link PrefSelector}
 * @see {@link Preference}
 */
export type PreferencesStore = Record<GroupSelector, PreferencesGroup>;
