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

			console.group('AuthState');
			console.log(
				'%sPrevious auth state',
				'color: blue, font-weight: bold',
				state
			);
			console.log(
				'%sDispatched auth action',
				'color: red, font-weight: bold',
				action
			);
			console.log('%sNext auth state', 'color: green', newState);
			console.groupEnd();

			return newState;
		},
		[reducer]
	);

	const value = useReducer(debug ? debugReducer : reducer, initialAuthState);

	return <AuthStateContext.Provider value={value} children={children} />;
}
