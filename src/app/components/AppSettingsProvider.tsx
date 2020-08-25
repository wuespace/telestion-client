import React, { ReactNode, useCallback, useReducer } from 'react';

import AppSettings, { AppSettingsReducer } from '../../model/AppSettings';
import ColorScheme, { validColorSchemes } from '../../model/ColorScheme';
import AppSettingsContext from '../../lib/AppSettingsContext';

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
	const debugReducer: AppSettingsReducer = useCallback(
		(state, action) => {
			const newState = reducer(state, action);

			console.groupCollapsed('%cAppSettings', 'font-weight: bold');
			console.log(
				'%cPrevious app settings',
				'color: blue; font-weight: bold',
				state
			);
			console.log(
				'%cDispatched app settings action',
				'color: red; font-weight: bold',
				action
			);
			console.log(
				'%cNext app settings',
				'color: green; font-weight: bold',
				newState
			);
			console.groupEnd();

			return newState;
		},
		[reducer]
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
