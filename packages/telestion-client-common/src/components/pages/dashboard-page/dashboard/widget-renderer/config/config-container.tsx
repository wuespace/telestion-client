import { ReactElement } from 'react';
import { Flex, View } from '@adobe/react-spectrum';

/**
 * React Props of {@link ConfigContainer}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link ConfigContainer}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface ConfigContainerProps {
	children: ReactElement | ReactElement[];
}

/**
 * This is the container element for the widget configuration.
 * @param children - the container elements
 *
 * @example
 * ```tsx
 * function WidgetRenderer() {
 * 	return inConfig ? (
 * 		<ConfigContainer>
 * 			{...elements}
 * 		</ConfigContainer>
 * 	) : (
 * 		<Content {...props}>
 * 	);
 * }
 * ```
 */
export function ConfigContainer({ children }: ConfigContainerProps) {
	return (
		<View width="100%" height="100%">
			<Flex direction="column" width="100%" height="100%">
				{children}
			</Flex>
		</View>
	);
}
