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

import React, { ReactNode, useCallback, useReducer } from 'react';

import { AppAction, AppReducer, AppState } from '../../model/AppState';
import AppStateContext from '../../lib/AppStateContext';
import ColorScheme, { validColorSchemes } from '../../model/ColorScheme';

function checkLocalStorage(
	key: string,
	defaultValue: ColorScheme
): ColorScheme {
	const storedValue = window.localStorage.getItem(key) || '';
	if (validColorSchemes.includes(storedValue as ColorScheme))
		return storedValue as ColorScheme;
	return defaultValue;
}

const KEY = 'app-state';

interface Props {
	defaultAppState: AppState;
	reducer: AppReducer;
	debug?: boolean;
	children: ReactNode;
}

export default function AppStateProvider({
	defaultAppState,
	reducer,
	debug = false,
	children
}: Props) {
	const debugReducer = useCallback(
		(state: AppState, action: AppAction) => {
			const newState = reducer(state, action);
			console.log(
				'Previous app state\n',
				state,
				'\nDispatched action\n',
				action,
				'\nNext app state\n',
				newState
			);
			return newState;
		},
		[reducer]
	);

	const storedReducer = useCallback(
		(state: AppState, action: AppAction) => {
			const newState = reducer(state, action);
			window.localStorage.setItem(KEY, newState.colorScheme);
			return newState;
		},
		[reducer]
	);

	const initialAppState: AppState = {
		...defaultAppState,
		colorScheme: checkLocalStorage(KEY, defaultAppState.colorScheme)
	};

	const value = useReducer(
		debug ? debugReducer : storedReducer,
		initialAppState
	);

	return <AppStateContext.Provider value={value} children={children} />;
}
