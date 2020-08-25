import { useState } from 'react';
import useAuthState from './useAuthState';
import useConnection from './useConnection';

export default function useConnectionManager() {
	const [{ credentials }, authDispatch] = useAuthState();
	const [, connectionDispatch] = useConnection();

	const [authenticated, setAuthenticated] = useState(false);

	return authenticated;
}
