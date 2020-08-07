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

import React, { ReactNode, useReducer } from 'react';

import { AppAction, AppReducer, AppState } from '../../model/AppState';
import AppStateContext from '../../lib/AppStateContext';

interface Props {
	initialAppState: AppState;
	reducer: AppReducer;
	debug?: boolean;
	children: ReactNode;
}

export default function AppStateProvider({
	initialAppState,
	reducer,
	debug = false,
	children
}: Props) {
	const debugReducer = (state: AppState, action: AppAction) => {
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
	};

	// TODO: use stored reducer hook
	const value = useReducer(debug ? debugReducer : reducer, initialAppState);

	return <AppStateContext.Provider value={value} children={children} />;
}
