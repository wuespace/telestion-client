import { CSSProperties } from 'react';
import { Popover } from '@react-spectrum/overlays';
import { FocusScope } from '@react-aria/focus';
import { DismissButton } from '@react-aria/overlays';

import { Section } from '@wuespace/telestion-client-types';
import { Menu } from './menu';

/**
 * React Props of {@link ContextMenu}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link ContextMenu}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface ContextMenuProps {
	/**
	 * The sections that the menu component should display.
	 */
	sections: Section[];

	/**
	 * The style of the menu container.
	 * (contains the absolute styling)
	 */
	style: CSSProperties;

	/**
	 * When `true` the menu should is displayed.
	 */
	isOpen: boolean;

	/**
	 * A function that are called when the menu should close.
	 */
	onClose: () => void;
}

/**
 * Renders a context menu at the given position
 * with the specified menu entries.
 *
 * @see {@link ContextMenuProps}
 *
 * @example
 * ```tsx
 * ContextMenuProviderProps['menu'] = (
 * 	sections,
 * 	style,
 * 	isOpen,
 * 	close
 * ) => (
 * 	<ContentMenu
 * 		sections={sections}
 * 		style={style}
 * 		isOpen={isOpen}
 * 		onClose={close}
 * 	/>
 * );
 *
 * function App() {
 *	return (
 *		<ContextMenuProvider menu={menu}>
 *			{...componentsContainingWrappers}
 *		</ContextMenuProvider>
 *	);
 * }
 * ```
 */
export function ContextMenu({
	sections,
	style,
	isOpen,
	onClose
}: ContextMenuProps) {
	return (
		<Popover
			isOpen={isOpen}
			UNSAFE_style={style}
			placement="center"
			hideArrow
			onClose={onClose}
			shouldCloseOnBlur
		>
			<FocusScope restoreFocus>
				<DismissButton onDismiss={onClose} />
				<Menu sections={sections} onClose={onClose} />
				<DismissButton onDismiss={onClose} />
			</FocusScope>
		</Popover>
	);
}
