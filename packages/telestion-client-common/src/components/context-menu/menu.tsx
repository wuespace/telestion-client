import { Key } from 'react';
import {
	Item,
	Text,
	Menu as RSMenu,
	Section as RSSection
} from '@adobe/react-spectrum';
import { Section } from '@wuespace/telestion-client-types';

/**
 * React Props of {@link Menu}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link Menu}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface MenuProps {
	/**
	 * The sections that the menu component should display.
	 */
	sections: Section[];

	/**
	 * A function that are called when the menu should close.
	 */
	onClose: () => void;
}

/**
 * Renders the menu of the context menu component.
 * It displays the given sections and calls the registered actions.
 *
 * @see {@link MenuProps}
 * @see {@link ContextMenu}
 *
 * @example
 * ```tsx
 * function ContextMenu({ isOpen, style, sections, onClose }: Props) {
 * 	return (
 * 		<Popover
 * 			isOpen={isOpen}
 * 			UNSAFE_style={style}
 * 			onClose={onClose}
 * 		>
 * 			<Menu sections={sections} onClose={onClose} />
 * 		</Popover>
 * 	);
 * }
 * ```
 */
export function Menu({ sections, onClose }: MenuProps) {
	const final = sections.map(({ items, title }, sIndex) => ({
		items: items.map((item, index) => ({ ...item, key: `${sIndex}${index}` })),
		title,
		key: `${sIndex}`
	}));

	const actions = final.reduce((acc, section) => {
		section.items.forEach(item => {
			acc[item.key] = item.action;
		});
		return acc;
	}, {} as Record<string, () => void>);

	const handle = (key: Key) => {
		actions[key]?.();
		onClose();
	};

	return (
		<RSMenu items={final} onAction={handle}>
			{section => (
				<RSSection
					key={section.key}
					title={section.title}
					items={section.items}
				>
					{item => (
						<Item key={item.key} textValue={item.title}>
							{item.icon}
							<Text>{item.title}</Text>
						</Item>
					)}
				</RSSection>
			)}
		</RSMenu>
	);
}
