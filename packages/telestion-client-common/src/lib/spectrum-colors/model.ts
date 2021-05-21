import {
	SpectrumColor,
	StaticSpectrumColor
} from '@wuespace/telestion-client-types';

/**
 * A type which maps a static spectrum color to a color value.
 */
export type StaticColorMap = Record<StaticSpectrumColor, string>;

/**
 * A type which maps a spectrum color to a color value
 * for a specific spectrum color theme.
 *
 * @see https://spectrum.adobe.com/page/color/#Color-themes-and-modes
 */
export type ColorMap = Record<SpectrumColor, string>;
