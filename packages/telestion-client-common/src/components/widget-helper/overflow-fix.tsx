import { ReactNode } from 'react';
import { View, ViewProps } from '@adobe/react-spectrum';

/**
 * React Props of {@link OverflowFix}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link OverflowFix}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface OverflowFixProps extends ViewProps<any> {
	/**
	 * The components which are possibly overflowing.
	 */
	children: ReactNode;
}

/**
 * Prevents the children of this component from overflowing
 * and breaking the application's layout.
 * The children of this component are wrapped inside a container
 * with a defined size. If the children needs more space
 * than the parent container has, it overflows
 * and the parent container renders vertical and horizontal scrollbars
 * if necessary.
 * The user can now scroll through the bigger children via the scrollbars
 * and no component inside the overflow fix breaks the outside layout.
 *
 * In the background, it uses the {@link @adobe/react-spectrum#View} component.
 * All props of this component get passed to the outer
 * {@link @adobe/react-spectrum#View} container.
 *
 * @see {@link OverflowFixProps}
 * @see {@link @adobe/react-spectrum#View}
 *
 * @example
 * ```ts
 * function MyComponent() {
 * 	return (
 * 	  <OverflowFix borderRadius="regular">
 * 	  	<IWillDefinitelyOverflow />
 * 	  </OverflowFix>
 * 	); // not anymore :D
 * }
 * ```
 */
export function OverflowFix({ children, ...viewProps }: OverflowFixProps) {
	return (
		// eslint-disable-next-line react/jsx-props-no-spreading
		<View width="100%" height="100%" position="relative" {...viewProps}>
			<View
				position="absolute"
				top={0}
				right={0}
				bottom={0}
				left={0}
				overflow="auto"
			>
				{children}
			</View>
		</View>
	);
}
