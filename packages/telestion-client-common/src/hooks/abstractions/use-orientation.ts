import { useWindowSize } from '@wuespace/telestion-client-core';

/**
 * Possible orientation values according to
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/@media/orientation}
 */
export type Orientation = 'landscape' | 'portrait';

/**
 * Hook to get the current window orientation.
 *
 * @example
 * ```ts
 * export function Container() {
 * 	   const orientation = useOrientation();
 *
 * 	   if (orientation === 'landscape') {
 * 	       return <div style="width: 100%;"></div>;
 * 	   } else {
 * 	       return <div style="height: 100%;"></div>;
 * 	   }
 * 	}
 * ```
 */
export function useOrientation(): Orientation | undefined {
	const windowSize = useWindowSize();
	if (!windowSize) return undefined;
	return windowSize.height >= windowSize.width ? 'portrait' : 'landscape';
}
