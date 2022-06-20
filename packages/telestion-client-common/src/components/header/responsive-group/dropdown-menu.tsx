import { ReactElement } from 'react';
import { Menu, Section, Item } from '@adobe/react-spectrum';

/**
 *
 */
export interface DropdownMenuProps {
	children: ReactElement | ReactElement[];
}

/**
 *
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
