/* eslint-disable react/jsx-props-no-spreading */
import { ReactNode } from 'react';
import { View } from '@adobe/react-spectrum';
import { ViewProps } from '@react-types/view';

/**
 * React Props of {@link OverflowFix}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link OverflowFix}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface OverflowFixProps extends ViewProps {
	/**
	 * The components which are possibly overflow.
	 */
	children: ReactNode;
}

/**
 * Prevents that the children of this component overflow
 * and break the layout of the application.
 *
 * In the background it uses the {@link @adobe/react-spectrum#View} component.
 * All props of this component are passed through to the outer view container.
 *
 * {@link @adobe/react-spectrum#View}
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
