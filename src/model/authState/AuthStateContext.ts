import { createContext, Dispatch } from 'react';

import AuthState, { AuthStateAction } from './AuthState';
import initialAuthState from './initialAuthState';

const AuthStateContext = createContext<[AuthState, Dispatch<AuthStateAction>]>([
	initialAuthState,
	() => {}
]);

export default AuthStateContext;
