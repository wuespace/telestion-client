import EventBus from '../lib/vertxEventBus';
import loggerManager from './logger';

const logger = loggerManager.getSubsystemLogger('Connection Model');

export type ConnectionState = 'connected' | 'disconnected' | 'error';

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
				connectionState: 'disconnected'
			};
		}

		throw new Error('Eventbus is already defined. Cannot create another one');
	};
}

export function deleteEventBus(): ConnectionAction {
	return state => {
		if (state.eventBus) {
			// clean up old eventbus
			state.eventBus.onOpen = () => {};
			state.eventBus.onClose = () => {
				logger.warn('Event bus closed');
			};
			state.eventBus.onError = () => {};
			state.eventBus.close();

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
