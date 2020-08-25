export interface Credentials {
	username: string;
	password: string;
	serverUrl: string;
}

export default interface AuthState {
	credentials: Credentials | null;
	error: string | null;
}

export type AuthStateAction = (state: AuthState) => AuthState;
export type AuthStateReducer = (
	state: AuthState,
	action: AuthStateAction
) => AuthState;

export function setCredentials(credentials: Credentials): AuthStateAction {
	return state => {
		return {
			...state,
			credentials,
			error: null
		};
	};
}

export function setError(error: string): AuthStateAction {
	return state => {
		return {
			...state,
			credentials: null,
			error
		};
	};
}

export function clearAuthState(): AuthStateAction {
	return state => {
		return {
			...state,
			credentials: null,
			error: null
		};
	};
}

export const authStateReducer: AuthStateReducer = (state, action) =>
	action(state);
