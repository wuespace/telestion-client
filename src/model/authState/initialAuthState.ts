import AuthState from './AuthState';

const initialAuthState: AuthState = {
	credentials: null,
	error: null,
	authenticated: false
};

export default initialAuthState;
