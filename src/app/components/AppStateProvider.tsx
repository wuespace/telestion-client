import React, { ReactNode, useReducer } from 'react';

import { AppReducer, AppState } from '../../model/AppState';
import AppStateContext from '../../lib/appStateProvider';

interface Props {
	initialAppState: AppState;
	reducer: AppReducer;
	children: ReactNode;
}

export default function AppStateProvider({
	initialAppState,
	reducer,
	children
}: Props) {
	const value = useReducer(reducer, initialAppState);

	return <AppStateContext.Provider value={value} children={children} />;
}
