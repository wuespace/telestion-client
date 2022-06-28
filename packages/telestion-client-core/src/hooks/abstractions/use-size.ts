import { RefObject, useLayoutEffect, useRef, useState } from 'react';
import useResizeObserver from '@react-hook/resize-observer';

/**
 * React Hook that determines the size of target {@link RefObject}
 * and returns the target object and its size as a {@link DOMRect}.
 *
 * @example
 * ```ts
 * export function RootComponent() {
 *     const [target, targetSize] = useSize<HTMLDivElement>();
 *     const [size, setSize] = useState<DOMRect>();
 *
 *     useEffect(() => {
 *         if (targetSize) setSize(targetSize);
 *     }, [targetSize]);
 *
 *     return (
 *         <div ref={target}>
 *             {size}
 *         </div>
 *     );
 * }
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
