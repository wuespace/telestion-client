import { useWindowSize } from '@wuespace/telestion-client-core';

/**
 * Possible orientation values according to
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/@media/orientation}
 */
export type Orientation = 'landscape' | 'portrait';

/**
 * Small helper function to calculate the orientation given a window width and height.
 * If the window height is greater or equal to window width,
 * the orientation is set to 'portrait', otherwise it is set to 'landscape'.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/@media/orientation}
 *
 * @param width - the window width
 * @param height - the window height
 */
function getOrientation(width: number, height: number): Orientation {
	return height >= width ? 'portrait' : 'landscape';
}

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
	return windowSize
		? getOrientation(windowSize.width, windowSize.height)
		: undefined;
}
