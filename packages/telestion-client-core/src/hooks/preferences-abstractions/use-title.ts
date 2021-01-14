import { PrefValue } from '@wuespace/telestion-client-types';
import { usePrefValue } from './use-pref-value';

/**
 * Returns the title of the application.
 *
 * @see {@link usePrefValue}
 * @see {@link usePreferences}
 *
 * @example
 * Displays the title of the application
 * ```ts
 * const title = useTitle();
 * return <p>Application title: {title}</p>;
 * ```
 */
export function useTitle(): PrefValue | undefined {
	return usePrefValue('null', 'title');
}
