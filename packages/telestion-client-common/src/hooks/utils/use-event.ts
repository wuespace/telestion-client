import { RefObject, useEffect, useRef } from 'react';

/**
 * Registers an event handler to a HTML element.
 * The returned ref should be attached to the HTML element
 * that should trigger the registered event.
 *
 * @param type - the type of event that should trigger the onContext function
 * @param onContext - the function that should be called
 * on a event on the HTML element
 *
 * @example
 * ```tsx
 * const handle = () => alert('Context alert');
 *
 * function MyComponent({ children }: Props) {
 * 	const ref = useEvent('contextmenu', handle);
 *
 * 	return (
 * 		<div ref={ref}>
 * 			{children}
 * 		</div>
 * 	);
 * }
 * ```
 */
export function useEvent<
	O extends HTMLElement,
	K extends keyof HTMLElementEventMap
>(type: K, onContext: (event: HTMLElementEventMap[K]) => void): RefObject<O> {
	const ref = useRef<O>(null);

	useEffect(() => {
		const { current } = ref;
		current?.addEventListener<K>(type, onContext);
		return () => current?.removeEventListener<K>(type, onContext);
	}, [onContext, type]);

	return ref;
}
