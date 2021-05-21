import { SpectrumColor } from '@wuespace/telestion-client-types';
import { useDarkColorScheme } from './abstractions';
import { darkColors, lightColors } from '../lib';

/**
 * Converts the given spectrum colors to hexadecimal colors.
 * It respects the application color scheme and changes to the suitable color.
 *
 * @param spectrumColors - the spectrum colors to convert to hexadecimal values
 * @returns the hexadecimal values
 *
 * @example
 * ```ts
 * const [color1, color2] = useSpectrumColor(['indigo-400', 'yellow-700']);
 *
 * console.log(color1); // #7575f1
 * console.log(color2); // c4a600
 * ```
 */
export function useSpectrumColor(spectrumColors: SpectrumColor[]): string[] {
	const isDark = useDarkColorScheme();

	return spectrumColors.map(spectrumColor =>
		isDark ? darkColors[spectrumColor] : lightColors[spectrumColor]
	);
}
