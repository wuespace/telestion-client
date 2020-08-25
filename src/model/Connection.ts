import { EventBus } from 'vertx3-eventbus-client';

export type ConnectionState = 'connected' | 'reconnecting' | 'disconnected';

export default interface Connection {
	eventBus: EventBus | null;
	connectionState: ConnectionState;
}

export type ConnectionAction = (state: Connection) => Connection;
export type ConnectionReducer = (
	state: Connection,
	action: ConnectionAction
) => Connection;

export function newEventBus(eventBus: EventBus): ConnectionAction {
	return state => {
		return {
			...state,
			eventBus,
			connectionState: 'disconnected'
		};
	};
}

export function closeEventBus(): ConnectionAction {
	return state => {
		state.eventBus?.close();
		return { ...state };
	};
}

export function changeConnectionState(
	connectionState: ConnectionState
): ConnectionAction {
	return state => {
		return {
			...state,
			connectionState
		};
	};
}

export const connectionReducer: ConnectionReducer = (state, action) =>
	action(state);
