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
		if (!state.eventBus) {
			return {
				...state,
				eventBus,
				connectionState: 'reconnecting'
			};
		}

		throw new Error('Eventbus is already defined. Cannot create another one');
	};
}

export function deleteEventBus(): ConnectionAction {
	return state => {
		if (state.eventBus) {
			// clean up old eventbus
			state.eventBus.close();
			state.eventBus.onopen = () => {};
			state.eventBus.onclose = () => {
				console.log('%cEventbus closed', 'color: red; font-weight: bold');
			};
			state.eventBus.onerror = () => {};

			return {
				...state,
				eventBus: null,
				connectionState: 'disconnected'
			};
		}

		throw new Error('Eventbus is not defined. Possible memory detected');
	};
}

export function changeConnectionState(
	connectionState: ConnectionState
): ConnectionAction {
	return state => ({
		...state,
		connectionState
	});
}

export const connectionReducer: ConnectionReducer = (state, action) =>
	action(state);
