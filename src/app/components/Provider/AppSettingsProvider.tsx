import React, { ReactNode, useCallback, useReducer } from 'react';

import AppSettings, {
	AppSettingsReducer
} from '../../../model/appSettings/AppSettings';
import ColorScheme, {
	validColorSchemes
} from '../../../model/appSettings/ColorScheme';
import AppSettingsContext from '../../../model/appSettings/AppSettingsContext';

import useLogger from '../../../hooks/useLogger';

const KEY = 'app-settings';

function getFromLocalStorage(
	key: string,
	defaultState: AppSettings
): AppSettings {
	try {
		const storedState = JSON.parse(
			window.localStorage.getItem(key) || 'undefined'
		);
		if (
			storedState &&
			storedState.hasOwnProperty('colorScheme') &&
			typeof storedState.colorScheme === 'string' &&
			validColorSchemes.includes(storedState.colorScheme as ColorScheme)
		) {
			return storedState as AppSettings;
		} else {
			return storedState;
		}
	} catch (err) {
		return defaultState;
	}
}

interface Props {
	defaultState: AppSettings;
	reducer: AppSettingsReducer;
	children: ReactNode;
	debug?: boolean;
}

export default function AppSettingsProvider({
	defaultState,
	reducer,
	children,
	debug
}: Props) {
	const logger = useLogger('App Settings Provider');

	const debugReducer: AppSettingsReducer = useCallback(
		(state, action) => {
			const newState = reducer(state, action);

			logger.debug(
				'\nPrevious app settings',
				state,
				'\nDispatched app settings action',
				action,
				'\nNext app settings',
				newState
			);

			return newState;
		},
		[logger, reducer]
	);

	const storedReducer: AppSettingsReducer = useCallback(
		(state, action) => {
			const newState = reducer(state, action);
			window.localStorage.setItem(KEY, JSON.stringify(newState));
			return newState;
		},
		[reducer]
	);

	const value = useReducer(
		debug ? debugReducer : storedReducer,
		getFromLocalStorage(KEY, defaultState)
	);

	return <AppSettingsContext.Provider value={value} children={children} />;
}
