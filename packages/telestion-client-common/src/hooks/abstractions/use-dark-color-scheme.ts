import { StateSelector } from 'zustand';
import { ColorSchemeState, useColorScheme } from '../stores';

// color scheme selector
const selector: StateSelector<
	ColorSchemeState,
	ColorSchemeState['colorScheme']
> = state => state.colorScheme;

/**
 * Returns `true` if the application is currently in dark mode.
 *
 * @see {@link @wuespace/telestion-client-common#useColorScheme}
 *
 * @throws TypeError - if invalid color scheme state
 * from `useColorScheme` received
 *
 * @example
 * ```ts
 * function MyComponent() {
 * 	const isDark = useDarkColorScheme();
 *  return (
 *    <div style={isDark ? { color: 'white' } : { color: 'black }}>
 *      Hello World
 *    </div>
 *  );
 * }
 * ```
 */
export function useDarkColorScheme(): boolean {
	const colorScheme = useColorScheme(selector);

	switch (colorScheme) {
		case 'system':
			return matchMedia('(prefers-color-scheme: dark)').matches;
		case 'light':
			return false;
		case 'dark':
			return true;
		default:
			throw new TypeError(
				`Invalid color scheme state received: ${colorScheme as string}`
			);
	}
}
