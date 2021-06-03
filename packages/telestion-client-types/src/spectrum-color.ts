/**
 * The spectrum color contrast ratios from 400 to 700.
 */
type R400700 = 400 | 500 | 600 | 700;

/**
 * The spectrum color contrast ratios from 300 to 700.
 */
type R300700 = 300 | R400700;

/**
 * The spectrum color contrast ratios from 400 to 800.
 */
type R400800 = R400700 | 800;

/**
 * The spectrum color contrast ratios from 200 to 700.
 */
type R200700 = 200 | R300700;

/**
 * The spectrum color contrast ratios from 200 to 800.
 */
type R200800 = R200700 | 800;

/**
 * The spectrum color contrast ratios from 50 to 900.
 */
type R50900 = 50 | 75 | 100 | R200800 | 900;

/**
 * A static spectrum color definition which is persistent across all themes.
 *
 * @see https://spectrum.adobe.com/page/color/#Color-themes-and-modes
 */
export type StaticSpectrumColor =
	| 'static-black'
	| 'static-white'
	| `static-${'gray'}-${R50900}`
	| `static-${'red' | 'orange' | 'green' | 'fuchsia'}-${R400700}`
	| `static-${'chartreuse'}-${R300700}`
	| `static-${'purple'}-${R400800}`
	| `static-${
			| 'celery'
			| 'yellow'
			| 'magenta'
			| 'indigo'
			| 'seafoam'}-${R200700}`
	| `static-${'blue'}-${R200800}`;

/**
 * A spectrum color definition which adapts to the current spectrum theme.
 *
 * @see https://spectrum.adobe.com/page/color/#Color-themes-and-modes
 */
export type SpectrumColor =
	| StaticSpectrumColor
	| `${
			| 'celery'
			| 'chartreuse'
			| 'yellow'
			| 'magenta'
			| 'fuchsia'
			| 'purple'
			| 'indigo'
			| 'seafoam'
			| 'red'
			| 'orange'
			| 'green'
			| 'blue'}-${R400700}`
	| `${'gray'}-${R50900}`;
