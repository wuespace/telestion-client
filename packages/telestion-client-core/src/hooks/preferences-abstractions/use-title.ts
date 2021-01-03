import { usePrefValue } from './use-pref-value';

/**
 * Returns the title of the application.
 */
export function useTitle() {
	return usePrefValue(null, 'title');
}
