/*
MIT License

Copyright (c) 2020 fliegwerk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import {
	Dispatch,
	Reducer,
	ReducerAction,
	ReducerState,
	useCallback,
	useReducer
} from 'react';

/**
 * Use a reducer which gets saved in the localStorage
 * @param key the key for storing it in the local storage
 * @param reducer a function to build a new state with an action and the current state
 * @param defaultState the initial state if no stored state was found
 */
export default function useStoredReducer<R extends Reducer<any, any>>(
	key: string,
	reducer: R,
	defaultState: ReducerState<R>
): [ReducerState<R>, Dispatch<ReducerAction<R>>] {
	const storedState = JSON.parse(window.localStorage.getItem(key) || 'null');
	// Use previously stored value or, if nonexistent, the default value:
	const initialState = storedState ?? defaultState;

	const reducerCb = useCallback(
		(state, action) => {
			const newState = reducer(state, action);
			window.localStorage.setItem(key, JSON.stringify(newState));
			return newState;
		},
		[key, reducer]
	);

	return useReducer(reducerCb, initialState);
}
