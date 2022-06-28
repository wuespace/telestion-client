import { ReactElement } from 'react';
import { Menu, Section, Item } from '@adobe/react-spectrum';

/**
 * React Props of {@link DropdownMenu}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link DropdownMenu}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface DropdownMenuProps {
	children: ReactElement | ReactElement[];
}

/**
 * A simple dropdown menu that can group children to increase
 * usability on smaller devices.
 *
 * @param children - child {@link ReactElement}s to fill the dropdown menu.
 *
 * @example
 * ```ts
 * export function DropdownActions({children}) {
 *     return (
 *     		<MenuTrigger>
 * 				<DropdownArrow />
 * 				<DropdownMenu>{children}</DropdownMenu>
 * 			</MenuTrigger>
 *     );
 * }
 * ```
 */
export function DropdownMenu({ children }: DropdownMenuProps) {
	return (
		<Menu>
			<Section title="Actions">
				{Array.isArray(children) ? (
					children.map((child, idx) => {
						// eslint-disable-next-line react/no-array-index-key
						return <Item key={`child${idx}`}>{child}</Item>;
					})
				) : (
					<Item>{children}</Item>
				)}
			</Section>
		</Menu>
	);
}
