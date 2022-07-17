import { useWindowSize } from '@wuespace/telestion-client-core';

/**
 * Type for the pre-defined React Spectrum screen sizes.
 *
 * @see {@link https://react-spectrum.adobe.com/react-spectrum/Provider.html}
 */
export type SpectrumSize = 'base' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

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
	if (!windowSize) return undefined;
	if (windowSize.width >= 1536) {
		return 'XXL';
	}
	if (windowSize.width >= 1280) {
		return 'XL';
	}
	if (windowSize.width >= 1024) {
		return 'L';
	}
	if (windowSize.width >= 768) {
		return 'M';
	}
	if (windowSize.width >= 640) {
		return 'S';
	}
	return 'base';
}
