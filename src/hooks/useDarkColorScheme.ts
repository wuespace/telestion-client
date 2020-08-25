import useAppSettings from './useAppSettings';

/**
 * Get the current color scheme of the application.
 * @returns true if the dark theme is in use otherwise false
 *
 * @see ColorScheme
 *
 * @example
 * const isDark = useDarkColorScheme();
 * return (
 * 	 <p color={isDark ? '#3f3f3f' : '#d4d4d4'}>
 * 	   The application is {isDark ? 'dark' : 'light'}
 * 	 </p>
 * );
 */
export default function useDarkColorScheme(): boolean {
	const [{ colorScheme }] = useAppSettings();

	switch (colorScheme) {
		case 'system':
			return matchMedia('(prefers-color-scheme: dark)').matches;
		case 'light':
			return false;
		case 'dark':
			return true;
	}
}
