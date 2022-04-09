import { Context, createContext } from 'react';
import { Position, Section } from '@wuespace/telestion-client-types';

/**
 * The state the context menu context provides.
 * It contains the current registered sections and a function
 * that calls the context menu at the specified position
 * with the specified sections.
 *
 * @see {@link ContextMenuContext}
 *
 * @example
 * ```tsx
 * const state: ContextMenuContextState = {
 * 	sections: [],
 * 	call: () => console.log('Context menu called')
 * };
 *
 * return (
 * 	<ContextMenuContext.Provider value={state}>
 * 		{children}
 * 	</ContextMenuContext.Provider>
 * );
 * ```
 */
export interface ContextMenuContextState {
	/**
	 * The current registered sections
	 * from context menu wrappers above in the tree.
	 */
	sections: Section[];

	/**
	 * A function to call the context menu with the specified sections
	 * and the clicked position from the user.
	 * @param sections - the sections the context menu should render
	 * @param position - the position coordinates
	 * where the context menu should open
	 */
	call: (sections: Section[], position: Position) => void;
}

/**
 * Provides the context for the context menu items and the call function.
 *
 * @see {@link ContextMenuContextState}
 *
 * @example
 * ```tsx
 * const state = {
 * 	sections: [],
 * 	call: () => console.log('Context menu called')
 * };
 *
 * return (
 * 	<ContextMenuContext.Provider value={state}>
 * 		{children}
 * 	</ContextMenuContext.Provider>
 * );
 * ```
 */
export const ContextMenuContext: Context<ContextMenuContextState> =
	createContext<ContextMenuContextState>({
		sections: [],
		call: () => {}
	});
