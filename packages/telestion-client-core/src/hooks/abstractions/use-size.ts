import { RefObject, useLayoutEffect, useRef, useState } from 'react';
import useResizeObserver from '@react-hook/resize-observer';

/**
 * React Hook that returns the target and its size.
 *
 * @example
 * ```ts
 *
 * ```
 */
export function useSize<T extends HTMLElement>(): readonly [
	target: RefObject<T>,
	size: DOMRect | undefined
] {
	const [size, setSize] = useState<DOMRect>();
	const target = useRef<T>(null);

	useLayoutEffect(() => {
		if (target.current) {
			setSize(target.current.getBoundingClientRect());
		}
	}, []);

	useResizeObserver(target, entry => setSize(entry.contentRect));
	return [target, size];
}
