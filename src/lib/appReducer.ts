import {
	AppAction,
	AppState,
	FETCH_USER,
	LOGIN,
	LOGOUT
} from '../model/AppState';

export default function appReducer(
	state: AppState,
	action: AppAction
): AppState {
	switch (action.type) {
		case LOGIN:
			return { ...state, auth: action.auth };
		case FETCH_USER:
			return { ...state, user: action.user };
		case LOGOUT:
			return { auth: null, user: null };
		default:
			throw new Error(`Unknown action ${action['type']}`);
	}
}
