export interface Credentials {
	username: string;
	password: string;
	serverUrl: string;
}

export default interface AuthState {
	credentials: Credentials | null;
	error: string | null;
	authenticated: boolean;
}

export type AuthStateAction = (state: AuthState) => AuthState;
export type AuthStateReducer = (
	state: AuthState,
	action: AuthStateAction
) => AuthState;

export function setCredentials(credentials: Credentials): AuthStateAction {
	return state => ({
		...state,
		credentials,
		authenticated: false,
		error: null
	});
}

// TODO: Update documentation
/**
 * Sets the user authentication state
 * and creates an action for an auth state dispatch function.
 * @returns an action for an auth state dispatch function
 *
 * @see AuthState
 * @see useAuthState
 *
 * @example
 * const [authState, dispatch] = useAuthState();
 * const { credentials } = authState;
 *
 * useEffect(() => {
 * 	 if (credentials) {
 * 	 	 // generic authentication function that checks the credentials
 *     authenticate(credentials)
 *     	 .then(authenticated => {
 *     	   dispatch(setAuthentication(authenticated));
 *     	 });
 *   }
 * }, [credentials, dispatch]);
 */
export function setAuthenticated(): AuthStateAction {
	return state => ({
		...state,
		authenticated: true
	});
}

export function setError(error: string): AuthStateAction {
	return state => ({
		...state,
		credentials: null,
		authenticated: false,
		error
	});
}

export function clearCredentials(): AuthStateAction {
	return state => ({
		...state,
		credentials: null,
		error: null
	});
}

export const authStateReducer: AuthStateReducer = (state, action) =>
	action(state);
