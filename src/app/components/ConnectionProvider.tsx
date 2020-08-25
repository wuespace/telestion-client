import React, { ReactNode, useCallback, useReducer } from 'react';

import Connection, { ConnectionReducer } from '../../model/Connection';
import ConnectionContext from '../../lib/ConnectionContext';

interface Props {
	initialConnection: Connection;
	reducer: ConnectionReducer;
	debug?: boolean;
	children: ReactNode;
}

export default function ConnectionProvider({
	initialConnection,
	reducer,
	children,
	debug
}: Props) {
	const debugReducer: ConnectionReducer = useCallback(
		(state, action) => {
			const newState = reducer(state, action);

			console.group('Connection');
			console.log(
				'%sPrevious connection',
				'color: blue, font-weight: bold',
				state
			);
			console.log(
				'%sDispatched connection action',
				'color: red, font-weight: bold',
				action
			);
			console.log('%sNext connection', 'color: green', newState);
			console.groupEnd();

			return newState;
		},
		[reducer]
	);

	const value = useReducer(debug ? debugReducer : reducer, initialConnection);

	return <ConnectionContext.Provider value={value} children={children} />;
}
