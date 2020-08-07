import User from './User';
import ColorScheme from './ColorScheme';
import ConnectionState from './ConnectionState';

export interface AppState {
	user: User | null;
	colorScheme: ColorScheme;
	connectionState: ConnectionState;
}

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SET_COLOR_SCHEME = 'SET_COLOR_SCHEME';
export const SET_CONNECTION_STATE = 'SET_CONNECTION_STATE';

interface LoginAction {
	type: typeof LOGIN;
	user: User;
}

interface LogoutAction {
	type: typeof LOGOUT;
}

interface SetColorSchemeAction {
	type: typeof SET_COLOR_SCHEME;
	colorScheme: ColorScheme;
}

interface SetConnectionStateAction {
	type: typeof SET_CONNECTION_STATE;
	connectionState: ConnectionState;
}

export type AppAction =
	| LoginAction
	| LogoutAction
	| SetColorSchemeAction
	| SetConnectionStateAction;

export type AppReducer = (state: AppState, action: AppAction) => AppState;
