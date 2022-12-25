/**
 * Type of valid color scheme:
 * - `light` - use always the light theme
 * - `dark` - use always the dark theme
 * - `system` - use the system defined colorscheme
 */
export type ColorScheme = 'light' | 'dark' | 'system';

/**
 * The color scheme store and actions of Telestion Client Common.
 *
 * Stores and handles the current color scheme of the application.
 *
 * @see {@link ColorSchemeState.colorScheme}
 * @see {@link ColorSchemeState.set}
 */
export interface ColorSchemeState {
	/**
	 * The current color scheme of the application.
	 * @see {@link ColorScheme}
	 */
	colorScheme: ColorScheme;

	/**
	 * Sets a new color scheme for the application.
	 * @param colorScheme - the new color scheme to use
	 *
	 * @see {@link ColorScheme}
	 */
	set: (colorScheme: ColorScheme) => void;
}
