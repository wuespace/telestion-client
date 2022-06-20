import { ReactElement } from 'react';
import { Flex, MenuTrigger } from '@adobe/react-spectrum';
import { DropdownArrow } from './dropdown-arrow';
import { DropdownMenu } from './dropdown-menu';

/**
 * React Props of {@link ResponsiveGroup}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link ResponsiveGroup}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface ResponsiveGroupProps {
	children: ReactElement | ReactElement[];
	condition: boolean;
}

/**
 * A wrapper for children that handles the responsive display of its children.
 *
 * @param children - components to be displayed
 * @param condition - condition that can be passed to decide, when the group is collapsing
 *
 */
export function ResponsiveGroup({ children, condition }: ResponsiveGroupProps) {
	return condition ? (
		<MenuTrigger>
			<DropdownArrow />
			<DropdownMenu>{children}</DropdownMenu>
		</MenuTrigger>
	) : (
		<Flex direction="row" gap="size-50">
			{children}
		</Flex>
	);
}
