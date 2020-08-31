import React, { ReactNode, useCallback, useReducer } from 'react';

import AuthState, {
	AuthStateReducer
} from '../../../model/authState/AuthState';
import AuthStateContext from '../../../model/authState/AuthStateContext';

import useLogger from '../../../hooks/useLogger';

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
	const logger = useLogger('Auth State Provider');

	const debugReducer: AuthStateReducer = useCallback(
		(state, action) => {
			const newState = reducer(state, action);

			logger.debug(
				'\nPrevious auth state:',
				state,
				'\nDispatched auth action:',
				action,
				'\nNext auth state:',
				newState
			);

			return newState;
		},
		[logger, reducer]
	);

	const value = useReducer(debug ? debugReducer : reducer, initialAuthState);

	return <AuthStateContext.Provider value={value} children={children} />;
}
