import { useContext } from 'react';
import ConnectionContext from '../lib/ConnectionContext';

export default function useConnection() {
	return useContext(ConnectionContext);
}
