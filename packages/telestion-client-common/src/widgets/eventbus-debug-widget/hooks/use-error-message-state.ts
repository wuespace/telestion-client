import { useEffect, useState } from 'react';
import { ErrorMessage } from '@wuespace/telestion-client-types';

/**
 * An error message item which holds the final content and a stable index.
 */
export interface Item {
	/**
	 * The stable index of the item.
	 * It does not change during re-renders
	 * and does not overlap with other items.
	 */
	index: number;

	/**
	 * The final content of the error message ready for render.
	 */
	content: string;
}

/**
 * The internal state of the {@link useErrorMessageState} hook.
 */
interface State {
	items: Item[];
	nextIndex: number;
}

/**
 * Stores and indexes the last error messages from the eventbus connection.
 * @param message - the last eventbus error message
 * (should update on new message)
 * @param maxItems - number of items to keep in state (defaults to `100`)
 * @returns items that are ready to render
 *
 * @example
 * ```tsx
 * const { eventBus, error, lastErrorMessage } = useEventBus(selector, shallow);
 * const items = useErrorMessageState(lastErrorMessage);
 *
 * return (
 * 	<div>
 * 		{items.map(item => (
 * 			<div key={item.index}>{item.content}</div>
 * 		))}
 * 	</div>
 * );
 * ```
 */
export function useErrorMessageState(
	message: ErrorMessage | null,
	maxItems = 100
): Item[] {
	const [state, setState] = useState<State>({
		items: [],
		nextIndex: 0
	});

	useEffect(() => {
		if (message) {
			setState(({ items, nextIndex }) => {
				const item: Item = {
					index: nextIndex,
					content: `${message.failureCode} ${message.failureType}: ${message.message}`
				};

				return {
					items: [item, ...items.slice(0, maxItems)],
					nextIndex: nextIndex + 1
				};
			});
		}
	}, [maxItems, message]);

	return state.items;
}
