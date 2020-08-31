import React, { ReactNode, useCallback, useReducer } from 'react';

import Connection, {
	ConnectionReducer
} from '../../../model/connection/Connection';
import ConnectionContext from '../../../model/connection/ConnectionContext';

import useLogger from '../../../hooks/useLogger';

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
	const logger = useLogger('Connection Provider');

	const debugReducer: ConnectionReducer = useCallback(
		(state, action) => {
			const newState = reducer(state, action);

			logger.debug(
				'Previous connection',
				state,
				'Dispatched connection action',
				action.name,
				'Next connection',
				newState
			);

			return newState;
		},
		[logger, reducer]
	);

	const value = useReducer(debug ? debugReducer : reducer, initialConnection);

	return <ConnectionContext.Provider value={value} children={children} />;
}
