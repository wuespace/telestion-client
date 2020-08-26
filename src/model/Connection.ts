import EventBus from '../lib/vertxEventBus';
import loggerManager from './logger';

const logger = loggerManager.getSubsystemLogger('Connection Model');

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
			state.eventBus.onOpen = () => {};
			state.eventBus.onClose = () => {
				logger.info('Event bus closed');
			};
			state.eventBus.onError = () => {};

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
