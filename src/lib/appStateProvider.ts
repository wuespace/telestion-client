import { createContext, Dispatch } from 'react';
import { AppAction, AppState } from '../model/AppState';

const AppStateContext = createContext<[AppState, Dispatch<AppAction>]>([
	{
		auth: null,
		user: null
	},
	() => {}
]);

export default AppStateContext;
