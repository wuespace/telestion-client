import { createContext, ReactNode, useContext } from 'react';

const sizeContext = createContext<DOMRect | undefined>(undefined);

/**
 * React Props of {@link SizeContext}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link SizeContext}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface SizeContextProps {
	/**
	 * Size as a {@link DOMRect} of the current application window.
	 */
	size?: DOMRect;
	/**
	 * The children components which have access to the application window
	 * size context via the {@link useWindowSize} hook.
	 */
	children: ReactNode;
}

/**
 * Wraps its children into the size context
 * which stores the application window size
 * and is accessible via the {@link useWindowSize} hook.
 *
 * @see {@link useWindowSize}
 * @see {@link SizeContextProps}
 *
 * @example
 * ```ts
 *
 * ```
 */
export function SizeContext({ size, children }: SizeContextProps) {
	return <sizeContext.Provider value={size}>{children}</sizeContext.Provider>;
}

/**
 * Returns the current application window size.
 *
 * @see {@link DOMRect}
 *
 * @example
 * ```ts
 * function WindowSize() {
 *     const windowSize = useWindowSize();
 *     return windowSize < 1024px ? <Flex direction='row' /> : <Flex direction='column'>;
 * }
 * ```
 */
export function useWindowSize(): DOMRect | undefined {
	return useContext(sizeContext);
}
