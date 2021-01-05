import { usePrefValue } from './use-pref-value';
import { PrefValue } from '../../model/preferences';

/**
 * Returns the title of the application.
 */
export function useTitle(): PrefValue | undefined {
	return usePrefValue('null', 'title');
}
