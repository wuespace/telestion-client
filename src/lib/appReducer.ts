import {
	AppAction,
	AppState,
	LOGIN,
	LOGOUT,
	SET_COLOR_SCHEME,
	SET_CONNECTION_STATE
} from '../model/AppState';

export default function appReducer(
	state: AppState,
	action: AppAction
): AppState {
	switch (action.type) {
		case LOGIN:
			return { ...state, user: action.user };
		case LOGOUT:
			return { ...state, user: null };
		case SET_COLOR_SCHEME:
			return { ...state, colorScheme: action.colorScheme };
		case SET_CONNECTION_STATE:
			return { ...state, connectionState: action.connectionState };
		default:
			throw new Error(`Unknown action ${action['type']}`);
	}
}
