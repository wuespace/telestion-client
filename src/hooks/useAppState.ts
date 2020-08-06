import { useContext } from 'react';
import AppStateContext from '../lib/appStateProvider';

export default function useAppState() {
	return useContext(AppStateContext);
}
