import { useCallback } from 'react';
import {
	GroupSelector,
	PrefSelector,
	PrefValue
} from '@wuespace/telestion-client-types';
import { usePreferences } from '../use-preferences';

/**
 * Returns the current value of a preference in a group.
 *
 * If the group selector is `null`
 * the preference in the global scope will be used.
 *
 * @param group - the group of the preference
 * @param preference - the name of the preference
 * @returns the current value of the preference
 *
 * @see {@link usePreferences}
 *
 * @example
 * ```ts
 * const myPref = usePrefValue('myGroup', 'myPref');
 *
 * return <div>{myPref}</div>;
 * ```
 */
export function usePrefValue(
	group: GroupSelector,
	preference: PrefSelector
): PrefValue | undefined {
	return usePreferences(
		useCallback(state => (state.preferences[group] || {})[preference].value, [
			group,
			preference
		])
	);
}
