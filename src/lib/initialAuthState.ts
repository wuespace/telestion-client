import AuthState from '../model/AuthState';

const initialAuthState: AuthState = {
	credentials: null,
	error: null,
	authenticated: false
};

export default initialAuthState;
