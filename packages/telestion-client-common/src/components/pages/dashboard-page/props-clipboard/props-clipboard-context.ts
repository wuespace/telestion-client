import { createContext } from 'react';
import { GenericProps } from '@wuespace/telestion-client-types';

/**
 * Contains the copied clipboard content.
 */
export interface ClipboardContent {
	name: string;
	props: GenericProps;
}

/**
 * Type for the return value of the {@link useState} hook.
 */
export type ClipboardContextType = [
	ClipboardContent | undefined,
	(newContent: ClipboardContent) => void
];

/**
 * The React context for the clipboard.
 *
 * @example
 * ```tsx
 * const state = useState<ClipboardContent>(null);
 *
 * return (
 * 	<ClipboardContext.Provider value={state}>
 * 		{...content}
 * 	</ClipboardContext.Provider>
 * );
 * ```
 */
export const ClipboardContext = createContext<ClipboardContextType>([
	undefined,
	() => {}
]);
