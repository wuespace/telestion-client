import { useCallback, useState } from 'react';

/**
 * The type for the initial state of the {@link useBooleanState} hook.
 * (same as {@link useState}'s initial state)
 */
export type InitialState = boolean | (() => boolean);

/**
 * The return type of the {@link useBooleanState} hook.
 */
export type ReturnType = readonly [
	/**
	 * The current boolean state.
	 */
	state: boolean,
	/**
	 * A function to set the boolean state to `true`.
	 * (this function is stable)
	 */
	setTrue: () => void,
	/**
	 * A function to set the boolean state to `false`.
	 * (this function is stable)
	 */
	setFalse: () => void
];

/**
 * Creates a React state which only can switch between `true` and `false`.
 * It returns the current boolean value
 * and two functions to update the current state
 * which are stable between re-renders.
 *
 * This hook is useful in situations where you open or close a modal
 * or switch between two different modes in your component.
 *
 * @param initialState - the initial value of the boolean state
 * (same as {@link useState}'s initial state)
 *
 * @example
 * ```tsx
 * function MyComponent() {
 * 	const [state, open, close] = useBooleanState();
 *
 * 	return (
 * 		<div>
 * 			<div>
 * 				<button onClick={open}>Open Modal</button>
 * 				<button onClick={close}>Close Modal</button>
 * 			</div>
 * 			<Modal state={state}>
 * 				{...content}
 * 			</Modal>
 * 		</div>
 * 	);
 * }
 * ```
 */
export function useBooleanState(
	initialState: InitialState = false
): ReturnType {
	const [state, setState] = useState(initialState);

	return [
		state,
		useCallback(() => setState(true), []),
		useCallback(() => setState(false), [])
	];
}
