import { useContext } from 'react';
import AuthStateContext from '../lib/AuthStateContext';

export default function useAuthState() {
	return useContext(AuthStateContext);
}
