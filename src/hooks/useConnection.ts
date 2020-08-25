import { useContext } from 'react';
import ConnectionContext from '../lib/ConnectionContext';

/**
 * Returns the current connection status
 * and a dispatch function to change the connection status.
 * @returns a tuple of the current connection status and a dispatch function
 *
 * @see Connection
 *
 * @example
 * const [connection, dispatch] = useConnection();
 * const { connectionState } = connection;
 *
 * const handleClick = () => {
 *   dispatch(changeConnectionState('disconnected'));
 * }
 *
 * return (
 *   <>
 *     <p>Connection state: {connectionState}</p>
 *     <button onClick={handleClick}>Logout</button>;
 *   </>
 * );
 */
export default function useConnection() {
	return useContext(ConnectionContext);
}
