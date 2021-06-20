import { ReactNode } from 'react';

/**
 * A position description which specifies
 * where the context menu should be rendered.
 */
export type Position = readonly [pageX: number, pageY: number];

/**
 * A definition for a menu item in a context menu.
 * Each item should have a title and a corresponding action
 * that are triggered if the user presses the context menu entry.
 *
 * @see {@link MenuItem.title}
 * @see {@link MenuItem.action}
 *
 * @example
 * ```tsx
 * import Alert from '@spectrum-icons/workflow/Alert';
 *
 * const items: MenuItem[] = [
 * 	{
 * 		title: 'First entry',
 * 		action: () => alert('You clicked first entry')
 * 	},
 * 	{
 * 		title: 'Second entry',
 * 		icon: <Alert />,
 * 		action: () => alert('You clicked second entry')
 * 	}
 * ];
 * ```
 */
export interface MenuItem {
	/**
	 * The title or label the menu entry should have.
	 */
	title: string;

	/**
	 * An optional icon that are rendered within the menu entry
	 * beside the {@link MenuItem.title}.
	 */
	icon?: ReactNode;

	/**
	 * The action that are triggered if the users presses the menu entry.
	 */
	action: () => void;
}

/**
 * A section contains multiple menu items and an optional title.
 * Different sections in a context menu should be separated
 * with a horizontal line for better visibility.
 *
 * @see {@link Section.items}
 * @see {@link Section.title}
 *
 * @example
 * ```ts
 * const section: Section = {
 * 	title: 'Section',
 * 	items: [
 * 		{
 * 			title: 'Entry 1',
 * 			action: () => alert('Entry clicked')
 * 		}
 * 	]
 * };
 *
 * const sections = [section, section2, section3];
 * ```
 */
export interface Section {
	/**
	 * An optional title for the section that are rendered
	 * beside the section or the section separator.
	 */
	title?: string;

	/**
	 * The menu items that are in this section.
	 *
	 * @see {@link MenuItem}
	 */
	items: MenuItem[];
}
