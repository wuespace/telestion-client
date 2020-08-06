import Auth from './Auth';
import User from './User';

export interface AppState {
	auth: Auth | null;
	user: User | null;
}

export const LOGIN = 'LOGIN';
export const FETCH_USER = 'FETCH_USER';
export const LOGOUT = 'LOGOUT';

interface LoginAction {
	type: typeof LOGIN;
	auth: Auth;
}

interface FetchUserAction {
	type: typeof FETCH_USER;
	user: User;
}

interface LogoutAction {
	type: typeof LOGOUT;
}

export type AppAction = LoginAction | FetchUserAction | LogoutAction;

export type AppReducer = (state: AppState, action: AppAction) => AppState;
