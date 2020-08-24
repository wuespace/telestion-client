import useAppState from './useAppState';
import { useEffect } from 'react';
import { SET_CONNECTION_STATE } from '../model/AppState';

const STEP_TIME = 3000; /* ms */

export default function useConnectionStateBlinker() {
	const [{ connectionState }, dispatch] = useAppState();

	useEffect(() => {
		let handler: NodeJS.Timeout | null = null;
		switch (connectionState) {
			case 'disconnected':
				handler = setTimeout(() => {
					dispatch({
						type: SET_CONNECTION_STATE,
						connectionState: 'reconnecting'
					});
				}, STEP_TIME);
				break;
			case 'reconnecting':
				handler = setTimeout(() => {
					dispatch({
						type: SET_CONNECTION_STATE,
						connectionState: 'connected'
					});
				}, STEP_TIME);
				break;
			case 'connected':
				handler = setTimeout(() => {
					dispatch({
						type: SET_CONNECTION_STATE,
						connectionState: 'disconnected'
					});
				}, STEP_TIME);
				break;
		}

		return () => {
			if (handler) clearTimeout(handler);
		};
	}, [connectionState, dispatch]);
}
