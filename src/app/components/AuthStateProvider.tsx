import React, { ReactNode, useCallback, useReducer } from 'react';

import AuthState, { AuthStateReducer } from '../../model/AuthState';
import AuthStateContext from '../../lib/AuthStateContext';

interface Props {
	initialAuthState: AuthState;
	reducer: AuthStateReducer;
	debug?: boolean;
	children: ReactNode;
}

export default function AuthStateProvider({
	initialAuthState,
	reducer,
	children,
	debug
}: Props) {
	const debugReducer: AuthStateReducer = useCallback(
		(state, action) => {
			const newState = reducer(state, action);

			console.groupCollapsed('AuthState');
			console.log('Previous auth state', state);
			console.log('Dispatched auth action', action);
			console.log('Next auth state', newState);
			console.groupEnd();

			return newState;
		},
		[reducer]
	);

	const value = useReducer(debug ? debugReducer : reducer, initialAuthState);

	return <AuthStateContext.Provider value={value} children={children} />;
}
