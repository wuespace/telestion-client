import { useWindowSize } from '@wuespace/telestion-client-core';

/**
 * Type for the pre-defined React Spectrum screen sizes.
 *
 * @see {@link https://react-spectrum.adobe.com/react-spectrum/Provider.html}
 */
export type SpectrumSize = 'base' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

/**
 * Returns a defined SpectrumSize given the width of the application window.
 *
 * @param width - width of the application window
 *
 */
function spectrumSize(width: number): SpectrumSize {
	if (width >= 1536) {
		return 'XXL';
	}
	if (width >= 1280) {
		return 'XL';
	}
	if (width >= 1024) {
		return 'L';
	}
	if (width >= 768) {
		return 'M';
	}
	if (width >= 640) {
		return 'S';
	}
	return 'base';
}

/**
 * React Hook that returns the current window size given in the pre-defined React Spectrum screen size.
 *
 * @example
 * ```ts
 *	export function Container() {
 *	   const spectrumSize = useSpectrumSize();
 *
 *	   if (spectrumSize === 'S') { ... }
 *	}
 * ```
 */
export function useSpectrumSize(): SpectrumSize | undefined {
	const windowSize = useWindowSize();
	return windowSize ? spectrumSize(windowSize.width) : undefined;
}
