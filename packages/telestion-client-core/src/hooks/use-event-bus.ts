import create from 'zustand';
import PropTypes from 'prop-types';

import { EventBus, ErrorMessage, Options } from '@wuespace/vertx-event-bus';
import { getLogger } from '../lib/logger';

const logger = getLogger('Connection State');

export type ConnectionState = 'connected' | 'disconnected' | 'error';

export type EventBusState = {
	/**
	 * the current eventbus instance for special purposes only
	 */
	eventBus: EventBus | null;

	/**
	 * the current connection state of the event bus
	 *
	 * Possible states:
	 * - `'connected'` if the eventbus is currently connected
	 * to the backend server
	 * - `'disconnected'` if the eventbus is currently disconnected
	 * from the backend server
	 * - `'error'` if the eventbus is currently open
	 * and an error message was received
	 */
	connectionState: ConnectionState;

	/**
	 * optional error message if something gone wrong on connection setup
	 */
	error: string | null;

	/**
	 * the last received error message through the event bus connection
	 */
	lastErrorMessage: ErrorMessage | null;

	/**
	 * Creates a new event bus which will automatically connect to the server URL
	 * and opens a connection.
	 * @param serverUrl the server URL to connect to
	 * @param options options to configure the connection of the event bus
	 *
	 * @throws if {@link openEventBus} was called earlier
	 * and an eventbus instance already opened
	 *
	 * @see {@link closeEventBus}
	 * @see {@link eventBus}
	 * @see {@link connectionState}
	 */
	openEventBus: (serverUrl: string, options?: Options) => void;

	/**
	 * Closes the current event bus and deletes it.
	 *
	 * @throws if {@link closeEventBus} was called earlier
	 * and an eventbus instance already closed
	 *
	 * @see {@link openEventBus}
	 * @see {@link eventBus}
	 * @see {@link connectionState}
	 */
	closeEventBus: () => void;
};

export const useEventBus = create<EventBusState>((set, get) => ({
	eventBus: null,
	connectionState: 'disconnected',
	error: null,
	lastErrorMessage: null,
	openEventBus: (serverUrl, options) => {
		let errorTimerId: NodeJS.Timeout;

		if (get().eventBus) {
			throw new TypeError(
				'Eventbus is already created. No need to create another one.'
			);
		}

		const eb = new EventBus(serverUrl, options);

		eb.onOpen = () => {
			eb.enableReconnect(true);
			set({ connectionState: 'connected' });
			logger.info('Eventbus opened');
		};

		eb.onClose = () => {
			if (errorTimerId) clearTimeout(errorTimerId);
			set({ connectionState: 'disconnected' });
			logger.warn('Eventbus closed');

			if (!eb.isReconnectEnabled) {
				// it's a connection error
				// close eventbus and delete it
				eb.close();
				set({ eventBus: null, error: 'Could not connect to server url' });
				logger.error('Could not connect to server url');
			}
		};

		eb.onError = message => {
			errorTimerId = setTimeout(() => {
				set({ connectionState: 'connected' });
			}, 2000);
			set({ connectionState: 'error', lastErrorMessage: message });
			logger.warn('Received error message:', message);
		};

		set({ eventBus: eb });
	},
	closeEventBus: () => {
		if (!get().eventBus) {
			throw new TypeError(
				'Eventbus is already closed. Possible memory leak detected.'
			);
		}

		// close and delete
		get().eventBus?.close();
		set({ eventBus: null });
	}
}));

export const ebOptionsPropTypes = PropTypes.shape({
	pingInterval: PropTypes.number,
	reconnectAttempts: PropTypes.number,
	reconnectExponent: PropTypes.number,
	delayMin: PropTypes.number,
	delayMax: PropTypes.number,
	randomizationFactor: PropTypes.number
});
