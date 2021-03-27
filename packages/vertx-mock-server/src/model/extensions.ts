import { Connection } from 'sockjs';
import { Message } from '@wuespace/telestion-client-types';

/**
 * Defines an event handler that gets called
 * when the Vert.x mock server is set up
 * and ready to handle incoming connections.
 *
 * @see {@link MockServer}
 */
export interface OnInit {
	/**
	 * An event handler which gets called
	 * when a the Vert.x mock server is set up
	 * and ready to handle incoming connections.
	 */
	onInit(): void;
}

/**
 * Defines an event handler that gets called
 * when a new connection with a client is established
 * and all {@link MockServer.register} calls has taken place.
 *
 * @see {@link MockServer}
 */
export interface OnConnection {
	/**
	 * An event handler which gets called
	 * when a new connection with a client is established
	 * and all {@link MockServer.register} calls has taken place.
	 *
	 * @param connection - the established connection with the client
	 */
	onConnection(connection: Connection): void;
}

/**
 * Defines an event handler that gets called when a messages arrives
 * at the Vert.x mock server from any connected client.
 *
 * @see {@link MockServer}
 */
export interface OnMessage {
	/**
	 * An event handler which gets called
	 * when a new message arrives at the event bus.
	 *
	 * @param message - the received message
	 */
	onMessage(message: Message): boolean | void;
}

/**
 * Defines an event handler that gets called
 * when a connection to a client has closed.
 *
 * @see {@link MockServer}
 */
export interface OnClosedConnection {
	/**
	 * An event handler which gets called
	 * when a connection to a client has closed.
	 *
	 * @param connection - the closed connection with the client
	 */
	onClosedConnection(connection: Connection): void;
}

/**
 * Defines an event handler that gets called
 * when the Vert.x mock server closed all still active connections
 * and will shutdown now.
 *
 * @see {@link MockServer}
 */
export interface OnClose {
	/**
	 * An event handler which gets called
	 * when the Vert.x mock server closed all still active connections
	 * and will shutdown now.
	 */
	onClose(): void;
}
