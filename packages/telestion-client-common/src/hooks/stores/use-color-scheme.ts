import create, { UseStore } from 'zustand';
import { ColorSchemeState } from './use-color-scheme.model';

/**
 * Returns the color scheme state and actions to interact with.
 * A selector can be defined to pick out parts of the store.
 * If correctly set up, the function only triggers a rerender
 * if the selected values have changed.
 *
 * For more information about state management in Zustand,
 * take a look at their {@link https://github.com/pmndrs/zustand | GitHub page}.
 *
 * @param selector - optional selector function
 * which picks the specified elements out of the store
 * @param equalityFn - optional equality function
 * to check for state updates on the picked elements
 * @returns the picked elements in the selector function
 *
 * @see {@link ColorSchemeState}
 * @see {@link https://github.com/pmndrs/zustand}
 * @see {@link UseStore}
 * @see {@link zustand#shallow}
 *
 * @example
 * Get and set color scheme:
 * ```ts
 * function ColorSchemeChanger() {
 * 	const { colorScheme, set } = useColorScheme(
 * 		state => ({
 * 			colorScheme: state.colorScheme,
 * 			set: state.set
 * 		}),
 * 		shallow
 * 	);
 *
 * 	return (
 * 		<>
 * 		  <p>Current colorscheme: {colorScheme}</p>
 * 		  <button onClick={() => set('dark')}>Set dark</button>;
 * 		</>
 * 	);
 * }
 * ```
 */
export const useColorScheme: UseStore<ColorSchemeState> =
	create<ColorSchemeState>(set => ({
		colorScheme: 'system',
		set: colorScheme => {
			set({ colorScheme });
		}
	}));
