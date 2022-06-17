import { SpectrumSize, useSpectrumSize } from './use-spectrum-size';

/**
 * The breakpoint checks defined by the active {@link SpectrumSize}.
 *
 * isMobile is a grouping for base, S and M, while
 * isDesktop is a grouping for L, XL and XXL
 */
export type Breakpoints = {
	isBase: boolean;
	isSm: boolean;
	isMd: boolean;
	isLg: boolean;
	isXl: boolean;
	isXXl: boolean;
	isMobile: boolean;
	isDesktop: boolean;
	active: SpectrumSize | undefined;
};

/**
 * React Hook to simplify the process of checking breakpoints.
 *
 * @example
 * ```ts
 * export function ResponsiveComponent() {
 *     const { isBase, isSm } = useBreakpoints();
 *
 *     return (
 *         <Button width={isBase || isSm ? "100%" : "size-400"}>Send</Button>
 *     );
 * }
 * ```
 */
export function useBreakpoints(): Breakpoints {
	const size = useSpectrumSize();

	return {
		isBase: size === 'base',
		isSm: size === 'S',
		isMd: size === 'M',
		isLg: size === 'L',
		isXl: size === 'XL',
		isXXl: size === 'XXL',
		isMobile: size ? size === 'S' || size === 'M' || size === 'base' : false,
		isDesktop: size ? size === 'L' || size === 'XL' || size === 'XXL' : false,
		active: size
	};
}
