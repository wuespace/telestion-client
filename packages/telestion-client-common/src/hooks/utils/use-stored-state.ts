import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { JsonSerializable } from '@wuespace/telestion-client-types';

/**
 * Use a state which gets saved in the localStorage
 * @param key - the key for storing it in the localStorage
 * @param defaultState - the default value if no value was previously set
 *
 * @example
 * ```ts
 * function MyComponent() {
 * 	const [myState, setMyState] = useState('my-key', 'hello world');
 *
 * 	return (
 * 		<div>
 * 			<div>{myState}</div>
 * 			<button onClick={() => setMyState('Clicked')}>Change State</button>
 * 			<button onClick={() => location.reload()}>Reload Page</button>
 * 		</div>
 * 	);
 * }
 * ```
 */
export function useStoredState<T extends JsonSerializable>(
	key: string,
	defaultState: T
): [T, Dispatch<SetStateAction<T>>] {
	const storedValue = window.localStorage.getItem(key);
	// Use previously stored value or, if nonexistent, the default value:
	const initialValue = storedValue ?? JSON.stringify(defaultState);

	const [state, setState] = useState<T>(JSON.parse(initialValue));

	// cache dispatch function for better performance
	const dispatch = useCallback<Dispatch<SetStateAction<T>>>(
		(value, ...args) => {
			return setState(prevState => {
				// handle function call
				const nextState =
					typeof value === 'function' ? value(prevState) : value;

				localStorage.setItem(key, JSON.stringify(nextState));
				return nextState;
			}, ...args);
		},
		[key]
	);

	return [state, dispatch];
}
