import { useContext } from 'react';
import AuthStateContext from '../model/authState/AuthStateContext';

/**
 * Returns the current auth state
 * and a dispatch function to change the auth state.
 * @returns a tuple of the current auth state and a dispatch function
 *
 * @see AuthState
 *
 * @example ```
 * const [authState, dispatch] = useAuthState();
 * const { credentials } = authState;
 *
 * const handleClick = () => {
 * 	 // logout the user and clear the credentials
 *   dispatch(clearAuthState());
 * };
 *
 * return (
 * 	 <>
 * 	   <p>
 * 	     Username: {credentials.username} Server URL: {credentials.serverUrl}
 * 	   </p>
 * 	   <button onClick={handleClick}>Logout</button>;
 * 	 </>
 * );
 * ```
 */
export default function useAuthState() {
	return useContext(AuthStateContext);
}
