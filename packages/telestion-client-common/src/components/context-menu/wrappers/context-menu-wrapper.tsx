import { ReactNode, useCallback, useContext, useMemo } from 'react';
import { MenuItem, Section } from '@wuespace/telestion-client-types';
import { useEvent } from '../../../hooks';
import {
	ContextMenuContext,
	ContextMenuContextState
} from './context-menu-context';

const style = {
	width: '100%',
	height: '100%'
};

/**
 * React Props of {@link ContextMenuWrapper}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link ContextMenuWrapper}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface ContextMenuWrapperProps {
	/**
	 * The menu items that should be accessible
	 * via the context menu on this component.
	 */
	menuItems: MenuItem[];

	/**
	 * An optional title of the section in the context menu.
	 */
	title?: string;

	/**
	 * Disables the rendering of sections in the context menu
	 * that are registered higher up in the tree.
	 */
	disableCascade?: boolean;

	/**
	 * The components that should have the registered
	 * {@link ContextMenuWrapperProps.menuItems} in their context menu.
	 */
	children: ReactNode;
}

/**
 * The wrapper provides access to the context menu
 * and allows the injection or replacement of menu items
 * deeply nested in the component tree.
 *
 * These menu items are displayed in the context menu
 * only for this component and their children beside menu items
 * that are registered higher up in the tree.
 *
 * This component is intended to be used nested inside each other.
 *
 * Set the `disableCascade` property to `true`
 * to "overwrite" the currently registered menu items higher up in the tree.
 *
 * The {@link ContextMenuProvider} is required higher up in the tree
 * for this component to work.
 *
 * @see {@link ContextMenuWrapperProps}
 * @see {@link ContextMenuProvider}
 *
 * @example
 * ```tsx
 * const items: MenuItem[] = [
 * 	{
 * 		title: 'Element1 1',
 * 		action: () => alert('Element1 1')
 * 	},
 * 	{
 * 		title: 'Element1 2',
 * 		action: () => alert('Element1 2')
 * 	}
 * ];
 *
 * function MyComponent({ children }: Props) {
 * 	return (
 * 		<ContextMenuWrapper menuItems={items}>
 * 			{children}
 * 		</ContextMenuWrapper>
 * 	);
 * }
 * ```
 */
export function ContextMenuWrapper({
	menuItems,
	disableCascade = false,
	title,
	children
}: ContextMenuWrapperProps) {
	const { sections, call } = useContext(ContextMenuContext);
	const newSections = useMemo<Section[]>(
		() => [{ title, items: menuItems }, ...(disableCascade ? [] : sections)],
		[disableCascade, menuItems, sections, title]
	);

	const handle = useCallback(
		(event: MouseEvent) => {
			event.preventDefault();
			event.stopPropagation();
			call(newSections, [event.pageX, event.pageY]);
		},
		[call, newSections]
	);

	const ref = useEvent<HTMLDivElement, 'contextmenu'>('contextmenu', handle);

	const newState = useMemo<ContextMenuContextState>(
		() => ({
			sections: newSections,
			call
		}),
		[newSections, call]
	);

	return (
		<ContextMenuContext.Provider value={newState}>
			<div
				style={style}
				ref={ref}
				data-testid="telestionClientContextMenuWrapper"
			>
				{children}
			</div>
		</ContextMenuContext.Provider>
	);
}
