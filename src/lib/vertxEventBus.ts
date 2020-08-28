/**
 * Rewritten, but heavily based on the vertx3-eventbus-client library.
 * Original copyright notice:
 *
 *   Copyright (c) 2011-2015 The original author or authors
 *   ------------------------------------------------------
 *   All rights reserved. This program and the accompanying materials
 *   are made available under the terms of the Eclipse Public License v1.0
 *   and Apache License v2.0 which accompanies this distribution.
 *
 *       The Eclipse Public License is available at
 *       http://www.eclipse.org/legal/epl-v10.html
 *
 *       The Apache License v2.0 is available at
 *       http://www.opensource.org/licenses/apache2.0.php
 *
 *   You may elect to redistribute this code under either of these licenses.
 * @packageDocumentation
 *
 * @category Utility
 */
import SockJS from 'sockjs-client';

import {
	Callback,
	Options,
	Message,
	Headers,
	ErrorMessage,
	ReceiveMessage,
	SendMessage
} from '../model/VertxEventBus';
import JSONSerializable from '../model/JSONSerializable';

import InvalidSocketStateError from './InvalidSocketStateError';

/**
 * the default options for the event bus
 * that are merged with the custom options in the constructor
 *
 * @see {@link EventBus.constructor}
 *
 * @example ```ts
 * constructor(url: string, options?: Partial<Options>) {
 *   this.options = { ...defaultOptions, ...options };
 *   ...
 * }
 * ```
 */
const defaultOptions: Options = {
	pingInterval: 5000 /* ms */,
	reconnectAttempts: Infinity,
	reconnectExponent: 2,
	delayMin: 1000 /* ms */,
	delayMax: 5000 /* ms */,
	randomizationFactor: 0.5
};

/**
 * An eventbus connector for the vertx environment.
 *
 * It implements the Javascript client-side of the SockJS event bus bridge
 * based on the online documentation by the Vert.x-Team
 * and their implementation:
 * https://vertx.io/docs/vertx-web/java/#_sockjs_event_bus_bridge
 * https://github.com/vert-x3/vertx-web/blob/master/vertx-web/src/client/vertx-eventbus.js
 *
 * Further information:
 * https://vertx.io/
 */
export default class EventBus {
	/**
	 * the state if the eventbus is currently connecting to the server
	 *
	 * @category EventBus State
	 */
	static get CONNECTING() {
		return WebSocket.CONNECTING;
	}

	/**
	 * the state if the eventbus is currently open
	 * and ready to handle incoming messages and send messages
	 *
	 * @category EventBus State
	 */
	static get OPEN() {
		return WebSocket.OPEN;
	}

	/**
	 * the state if the eventbus is currently closing
	 * and no further messages are handled
	 *
	 * @category EventBus State
	 */
	static get CLOSING() {
		return WebSocket.CLOSING;
	}

	/**
	 * the state if the eventbus is currently closed
	 * and cannot send and receive anything
	 *
	 * @category EventBus State
	 */
	static get CLOSED() {
		return WebSocket.CLOSED;
	}

	/**
	 * Returns a human readable state name for the given eventbus state.
	 * @param stateId the eventbus state to translate
	 * @returns a human readable state name
	 *
	 * @see {@link state}
	 *
	 * @example ```ts
	 * const eventBus = new EventBus('http://localhost:8081/bridge');
	 * console.log('EventBus state: ', EventBus.getStateName(eventBus.state));
	 * ```
	 */
	static getStateName(stateId: number): string {
		switch (stateId) {
			case EventBus.CONNECTING:
				return 'CONNECTING';
			case EventBus.OPEN:
				return 'OPEN';
			case EventBus.CLOSING:
				return 'CLOSING';
			case EventBus.CLOSED:
				return 'CLOSED';
			default:
				return 'INVALID_STATE';
		}
	}

	/**
	 * the options as readonly member for the current event bus instance
	 * as a merge of the default options and the in the constructor given options
	 * for the event bus instance
	 *
	 * @see {@link "model/VertxEventBus".Options | Options}
	 * @see {@link constructor}
	 *
	 * @example ```ts
	 * // set ping interval to 2 seconds
	 * const eventBus = new EventBus('http://localhost:8081/bridge', {
	 *   pingInterval: 2000
	 * });
	 *
	 * // read ping interval
	 * console.log('Ping interval: ', eventBus.options.pingInterval);
	 * ```
	 */
	readonly options: Options;

	/**
	 * the web socket managed by the eventbus and not accessible to the outside
	 *
	 * Here are the eventbus bridge packages sent and received
	 * if the web socket is open.
	 *
	 * @see {@link decodeMessage}
	 * @see {@link encodeMessage}
	 *
	 * @category EventBus Internal
	 *
	 * @example ```ts
	 * // send a ping through the socket
	 * this.socket.send(EventBus.encodeMessage({ type: 'ping' }));
	 *
	 * // all methods and accessors of the web socket are available
	 * this.socket.onmessage = function (this: WebSocket, ev: EventMessage) {
	 * 	 const message = EventBus.decodeMessage(ev.data);
	 * 	 console.log('Received message:', message);
	 * }
	 * ```
	 */
	private socket: WebSocket;

	/**
	 * an object that stores all registered event handlers
	 * via the registerHandler method
	 *
	 * In the object are arrays of callbacks map to the channel they listen to.
	 *
	 * If no callback is listen to a channel,
	 * the entire key-value pair is deleted.
	 *
	 * @see {@link registerHandler}
	 * @see {@link unregisterHandler}
	 * @see {@link setupConnection}
	 *
	 * @category EventBus Internal
	 *
	 * @example ```ts
	 * // some event bus channel
	 * const channel = 'CHANNEL_ADDRESS';
	 *
	 * // some message and error message
	 * const successMessage = { type: 'rec', body: {} };
	 * const errorMessage = null;
	 *
	 * // check if channel is available
	 * if (this.handlers[channel]) {
	 *   // iterate of all registered handlers
	 *   that.handlers[message.address].forEach(handler => {
	 *     handler(
	 *       successMessage as SuccessMessage,
	 *       errorMessage as ErrorMessage
	 *     );
	 *   });
	 * }
	 * ```
	 */
	private readonly handlers: { [key: string]: Array<Callback> };

	/**
	 * an object that stores a specific callback for a reply message
	 * via the send method
	 *
	 * @see {@link send}
	 * @see {@link setupConnection}
	 *
	 * @category EventBus Internal
	 *
	 * @example ```ts
	 * // some message
	 * const message = { type: 'rec', address: 'SOME_UUID' body: {} };
	 *
	 * // some message and error message
	 * const successMessage = { type: 'rec', address: 'SOME_UUID' body: {} };
	 * const errorMessage = null;
	 *
	 * // check if channel is available
	 * if (this.replyHandlers[message.address]) {
	 *   this.replyHandlers[message.address](
	 *     successMessage as SuccessMessage,
	 *     errorMessage as ErrorMessage
	 *   );
	 *   // call reply handler only once
	 *   delete that.replyHandlers[message.address];
	 * }
	 * ```
	 */
	private readonly replyHandlers: { [key: string]: Callback };

	/**
	 * the ping timer id generated by a setInterval
	 *
	 * stores the current ping timer id if pinging is enabled otherwise null
	 *
	 * @see {@link NodeJS.Timeout}
	 * @see {@link setInterval}
	 * @see {@link enablePing}
	 * @see {@link options}
	 *
	 * @category EventBus Internal
	 *
	 * @example ```ts
	 * // get ping interval from options
	 * const { pingInterval } = this.options;
	 *
	 * if (this.pingTimerId) clearInterval(this.pingTimerId);
	 * this.pingTimerId = setInterval(() => {
	 *   this.sendPing();
	 * }, pingInterval);
	 * ```
	 */
	private pingTimerId: any;

	/**
	 * the reconnect timer id generated by a setTimeout
	 *
	 * stores the current reconnect timer if:
	 * - the web socket has unexpectedly closed
	 * - automatic reconnect is enabled
	 * - and the reconnect attempts specified in the options are not reached
	 *
	 * otherwise null
	 *
	 * @see {@link NodeJS.Timeout}
	 * @see {@link setTimeout}
	 * @see {@link setupConnection | setupConnection (here socket.onclose)}
	 * @see {@link reconnectEnabled}
	 * @see {@link reconnectAttempts}
	 * @see {@link newReconnectDelay}
	 *
	 * @category EventBus Internal
	 *
	 * @example ```ts
	 * if (this.pingTimerId) clearInterval(this.pingTimerId);
	 * if (
	 *   this.reconnectEnabled &&
	 *   this.reconnectAttempts < this.options.reconnectAttempts
	 * ) {
	 *   this.reconnectTimerId = setTimeout(() => {
	 *     this.socket = this.setupConnection(url, options);
	 *   }, this.newReconnectDelay());
	 *
	 *   ++this.reconnectAttempts;
	 * }
	 * ```
	 */
	private reconnectTimerId: any;

	/**
	 * true if automatic reconnect is enabled otherwise false
	 *
	 * is set in enableReconnect
	 * and used in setupConnections especially in socket.onclose
	 *
	 * If automatic reconnect is enabled,
	 * the event bus tries to reconnect to the backend server
	 * in increasing time steps until a connection is re-established.
	 *
	 * @see {@link enableReconnect}
	 * @see {@link setupConnection | setupConnection (here socket.onclose)}
	 * @see {@link reconnectTimerId}
	 * @see {@link newReconnectDelay}
	 *
	 * @category EventBus Internal
	 *
	 * @example ```ts
	 * if (this.reconnectEnabled) {
	 *   this.reconnectTimerId = setTimeout(() => {
	 *     this.socket = this.setupConnection(url, options);
	 *   }, this.newReconnectDelay());
	 *
	 *   ++this.reconnectAttempts;
	 * }
	 * ```
	 */
	private reconnectEnabled: boolean;

	/**
	 * number of reconnect attempts after loss of communication
	 * via the web socket if automatic reconnect is enabled
	 *
	 * is reset to 0 if reconnect was successful
	 *
	 * @see {@link reconnectEnabled}
	 * @see {@link setupConnection | setupConnection (here socket.onclose)}
	 * @see {@link reconnectTimerId}
	 * @see {@link newReconnectDelay}
	 *
	 * @category EventBus Internal
	 *
	 * @example ```ts
	 * if (this.reconnectEnabled) {
	 *   this.reconnectTimerId = setTimeout(() => {
	 *     this.socket = this.setupConnection(url, options);
	 *   }, this.newReconnectDelay());
	 *
	 *   ++this.reconnectAttempts;
	 * }
	 * ```
	 */
	private reconnectAttempts: number;

	/**
	 * an event listener to be called when:
	 * - the event bus is opened
	 * - has reconnected after a connection loss
	 *
	 * @see {@link setupConnection | setupConnection (here socket.onopen)}
	 * @see {@link constructor}
	 *
	 * @category EventBus Event Listener
	 *
	 * @example ```ts
	 * const eventBus = new EventBus('http://localhost:8081/bridge');
	 *
	 * eventBus.onOpen = () => {
	 *   console.log('Event bus has opened');
	 * };
	 *
	 * // on connection is open or succesful reconnect
	 * // -> 'Event bus has opened'
	 * ```
	 */
	onOpen?: () => void;

	/**
	 * an event listener to be called when:
	 * - the event bus is closed
	 * - has lost the connection
	 * - after an automatic reconnect failure if automatic reconnect is enabled
	 *
	 * @see {@link enableReconnect}
	 * @see {@link constructor}
	 * @see {@link setupConnection | setupConnection (here socket.onclose)}
	 *
	 * @category EventBus Event Listener
	 *
	 * @example ```ts
	 * const eventBus = new EventBus('http://localhost:8081/bridge');
	 * // enable automatic reconnect
	 * const eventBus.enableReconnect(true);
	 *
	 * eventBus.onClose = () => {
	 *   console.log('Event bus has lost connection');
	 * };
	 *
	 * // on connection loss or reconnect failure
	 * // -> 'Event bus has lost connection'
	 * ```
	 */
	onClose?: () => void;

	/**
	 * an event listener to be called when:
	 * - the event bus has reconnected if automatic reconnect is enabled
	 *
	 * @see {@link enableReconnect}
	 * @see {@link constructor}
	 * @see {@link setupConnection | setupConnection (here socket.onopen)}
	 *
	 * @category EventBus Event Listener
	 *
	 * @example ```ts
	 * const eventBus = new EventBus('http://localhost:8081');
	 * // enable automatic reconnect
	 * const eventBus.enableReconnect(true);
	 *
	 * eventBus.onReconnect = () => {
	 *   console.log('Event bus has reconnected after a connection loss');
	 * };
	 *
	 * // on successful reconnect
	 * // -> 'Event bus has reconnected after a connection loss'
	 * ```
	 */
	onReconnect?: () => void;

	/**
	 * an event listener to be called when:
	 * - the connection is open and a error message is sent via the socket
	 *
	 * In the default configuration it logs the error message to the console
	 * with console.error.
	 *
	 * @see {@link constructor}
	 * @see {@link setupConnection | setupConnection (here socket.onmessage)}
	 *
	 * @category EventBus Event Listener
	 *
	 * @example ```ts
	 * const eventBus = new EventBus('http://localhost:8081');
	 *
	 * eventBus.onError = (err) => {
	 *   console.log('Received error message:', err);
	 * };
	 *
	 * // on an error message
	 * // -> Received error message: {
	 * //      type: 'err',
	 * //      failureCode: 123,
	 * //      failureType: '...',
	 * //      message: '...'
	 * //    }
	 * ```
	 */
	onError?: (err: ErrorMessage) => void;

	/**
	 * Builds a new event bus
	 * that automatically tries to connect to the given server url.
	 *
	 * It uses the given options to configure the event bus instance
	 * and fall back on default options if some of the given options are not set.
	 *
	 * @param url the server url to connect to
	 * @param options options to configure the event bus
	 * @returns an event bus instance
	 *
	 * @see {@link onOpen}
	 * @see {@link publish}
	 *
	 * @example ```ts
	 * // some vertx event bus channel
	 * const channel = 'EVENTBUS_CHANNEL';
	 *
	 * // build a new event bus instance
	 * const eventBus = new EventBus('http://localhost:8081/bridge');
	 * // set an event listener when the the event bus is open
	 * eventBus.onOpen = () => {
	 *   // publish a simple message to the event bus
	 *   eventBus.publish(channel, 'Hello World');
	 * };
	 * ```
	 */
	constructor(url: string, options?: Partial<Options>) {
		this.options = { ...defaultOptions, ...options };
		this.handlers = {};
		this.replyHandlers = {};
		this.reconnectEnabled = false;
		this.reconnectAttempts = 0;
		this.onError = (error: ErrorMessage) => {
			console.error(error);
		};
		this.socket = this.setupConnection(url);
	}

	/**
	 * Returns the current state of the event bus.
	 * Currently it can be connecting, open, closing and closed.
	 *
	 * It is comparable to the event bus state accessors
	 * and can be converted into a human readable string with getStateName.
	 *
	 * @see {@link CONNECTING}
	 * @see {@link OPEN}
	 * @see {@link CLOSING}
	 * @see {@link CLOSED}
	 * @see {@link getStateName}
	 *
	 * @category Connection
	 *
	 * @example ```ts
	 * const eventBus = new EventBus('http://localhost:8081/bridge');
	 * // get current state from event bus
	 * const state = eventBus.state;
	 * // convert to human readable name
	 * console.log(EventBus.getStateName(state));
	 * ```
	 */
	get state(): number {
		return this.socket.readyState;
	}

	/**
	 * Returns true if ping is enabled otherwise false.
	 *
	 * @see {@link enablePing}
	 * @see {@link pingTimerId}
	 *
	 * @category Connection
	 *
	 * @example ```ts
	 * const eventBus = new EventBus('http://localhost:8081/bridge');
	 *
	 * eventBus.onOpen = () => {
	 *   console.log(eventBus.isPingEnabled);
	 *   // -> 'true'
	 * }
	 * ```
	 */
	get isPingEnabled(): boolean {
		return !!this.pingTimerId;
	}

	/**
	 * Returns true if automatic reconnect is enabled otherwise false.
	 *
	 * @see {@link enableReconnect}
	 * @see {@link reconnectEnabled}
	 *
	 * @category Connection
	 *
	 * @example ```ts
	 * const eventBus = new EventBus('http://localhost:8081/bridge');
	 *
	 * eventBus.onOpen = () => {
	 *   console.log(eventBus.isReconnectEnabled);
	 *   // -> 'false'
	 *   eventBus.enableReconnect(true);
	 *   console.log(eventBus.isReconnectEnabled);
	 *   // -> 'true'
	 * }
	 * ```
	 */
	get isReconnectEnabled(): boolean {
		return this.reconnectEnabled;
	}

	/**
	 * Returns the number of reconnection attempts
	 * if the socket has unexpectedly closed
	 * and automatic reconnection is enabled otherwise 0.
	 *
	 * Resets to 0 if the connection is re-established.
	 *
	 * @see {@link reconnectAttempts}
	 * @see {@link enableReconnect}
	 *
	 * @category Connection
	 *
	 * @example ```ts
	 * const eventBus = new EventBus('http://localhost:8081/bridge');
	 * // enable automatic reconnect
	 * eventBus.enableReconnect(true);
	 *
	 * // later, the event bus closes unexpectedly and cannot reconnect
	 * console.log(eventBus.reconnectionAttempts);
	 * // -> number > 0
	 * ```
	 */
	get reconnectionAttempts(): number {
		return this.reconnectAttempts;
	}

	/**
	 * Enable or disable continuous ping message send on an open event bus.
	 *
	 * The ping interval can be defined in the options on event bus creation.
	 *
	 * Is automatically enabled when the event bus is opened
	 * and disabled when the event bus is closed.
	 *
	 * **Use with caution!
	 * The backend server closes the connection
	 * if no ping messages are sent in a specific interval!**
	 * @param enable true to enable continuous ping message, false to disable
	 *
	 * @see {@link isPingEnabled}
	 * @see {@link "model/VertxEventBus".Options | Options}
	 * @see {@link onOpen}
	 *
	 * @category Connection
	 *
	 * @example ```ts
	 * const eventBus = new EventBus('http://localhost:8081/bridge');
	 *
	 * eventBus.onOpen = () => {
	 *   // disable ping message send for 1 second
	 *   eventBus.enablePing(false);
	 *   setTimeout(() => {
	 *     eventBus.enablePing(true);
	 *   }, 1000);
	 * };
	 * ```
	 */
	enablePing(enable: boolean) {
		const { pingInterval } = this.options;

		if (enable && pingInterval > 0) {
			this.sendPing();
			this.pingTimerId = setInterval(() => {
				this.sendPing();
			}, pingInterval);
		} else if (this.pingTimerId) {
			clearInterval(this.pingTimerId);
			this.pingTimerId = null;
		}
	}

	/**
	 * Enable or disable automatic reconnect on unexpected connection loss.
	 *
	 * If automatic reconnect is enabled,
	 * the event bus tries to reconnect to the backend server
	 * in increasing time steps until a connection is re-established.
	 *
	 * initially disabled
	 *
	 * @param enable true to enable automatic reconnect, false to disable
	 *
	 * @see {@link isReconnectEnabled}
	 * @see {@link onReconnect}
	 * @see {@link newReconnectDelay}
	 *
	 * @category Connection
	 *
	 * @example ```ts
	 * const eventBus = new EventBus('http://localhost:8081/bridge');
	 * // enable automatic reconnect
	 * eventBus.enableReconnect(true);
	 *
	 * eventBus.onReconnect = () => {
	 *   console.log('Event bus has reconnected');
	 * };
	 * ```
	 */
	enableReconnect(enable: boolean) {
		this.reconnectEnabled = enable;
		if (!enable && this.reconnectTimerId) {
			clearTimeout(this.reconnectTimerId);
			this.reconnectTimerId = null;
			this.reconnectAttempts = 0;
		}
	}

	/**
	 * Register an event handler to the specified channel.
	 *
	 * The given callback is executed when a message receives the event bus
	 * on the specified channel.
	 *
	 * The specified headers are sent with the register message
	 * that goes to the backend on the first register event call
	 * for this specified channel.
	 *
	 * @param channel the channel to register the event handler
	 * that executes the callback on incoming messages
	 * @param callback the function that will be executed
	 * on incoming messages on the specified channel
	 * @param headers optional headers sent with the initial register message
	 * to the backend on the first register event
	 *
	 * @throws if the event bus is not open
	 *
	 * @see {@link unregisterHandler}
	 * @see {@link onOpen}
	 *
	 * @category Vertx EventBus
	 *
	 * @example ```ts
	 * // some vertx eventbus channel to register to
	 * const channel = 'MY_CHANNEL';
	 *
	 * // define a handler
	 * const handler: Callback = (message, err) => {
	 *   if (err) {
	 *     console.error(err);
	 *   } else {
	 *     console.log(message);
	 *   }
	 * };
	 *
	 * const eventBus = new EventBus('https://localhost:8081/bridge');
	 *
	 * eventBus.onOpen = () => {
	 *   eventBus.registerHandler(channel, handler);
	 * };
	 *
	 * // later
	 * // unregister handler
	 * eventBus.unregisterHandler(channel, handler);
	 * ```
	 */
	registerHandler(channel: string, callback: Callback, headers?: Headers) {
		if (this.state !== EventBus.OPEN)
			throw new InvalidSocketStateError(
				EventBus.getStateName(this.state),
				EventBus.getStateName(EventBus.OPEN)
			);

		if (!this.handlers[channel]) {
			this.handlers[channel] = [];
			// First handler for this address so we should register the connection
			this.subscribeToChannel(channel, headers);
		}

		this.handlers[channel].push(callback);
	}

	/**
	 * Unregister an event handler from the specified channel.
	 *
	 * The identity of the callback must be same as
	 * in the register handler method
	 * to successfully remove the event handler.
	 *
	 * The specified headers are sent with the unregister message
	 * that goes to the backend,
	 * if no other event handler registered for this channel.
	 *
	 * @param channel the channel to unregister the event handler
	 * @param callback the callback to unregister from the channel
	 * @param headers optional headers sent with the last unregister message
	 * to the backend on the last unregister message
	 *
	 * @throws if the event bus is not open
	 *
	 * @see {@link registerHandler}
	 *
	 * @category Vertx EventBus
	 */
	unregisterHandler(channel: string, callback: Callback, headers?: Headers) {
		if (this.state !== EventBus.OPEN)
			throw new InvalidSocketStateError(
				EventBus.getStateName(this.state),
				EventBus.getStateName(EventBus.OPEN)
			);

		const handlers = this.handlers[channel];
		if (handlers) {
			const newHandlers = handlers.filter(handler => handler !== callback);

			if (newHandlers.length > 0) {
				this.handlers[channel] = newHandlers;
			} else {
				delete this.handlers[channel];
				// No more local handlers so we should unregister the connection
				this.unsubscribeFromChannel(channel, headers);
			}
		}
	}

	/**
	 * Broadcasts or publishes a message to the specified channel.
	 *
	 * @param channel channel in which the message is sent
	 * @param message message to send
	 * @param headers optional headers sent with the event bus message
	 *
	 * @throws if the event bus is not open
	 *
	 * @see {@link onOpen}
	 *
	 * @category Vertx EventBus
	 *
	 * @example ```ts
	 * // some vertx eventbus channel to publish to
	 * const channel = 'MY_CHANNEL';
	 *
	 * const eventBus = new EventBus('http://localhost:8081/bridge');
	 *
	 * eventBus.onOpen = () => {
	 *   eventBus.publish(channel, 'Hey there!');
	 * }
	 * ```
	 */
	publish(channel: string, message: JSONSerializable, headers?: Headers) {
		if (this.state !== EventBus.OPEN)
			throw new InvalidSocketStateError(
				EventBus.getStateName(this.state),
				EventBus.getStateName(EventBus.OPEN)
			);

		this.socket.send(
			EventBus.encodeMessage({
				type: 'publish',
				address: channel,
				headers: headers || {},
				body: message
			})
		);
	}

	/**
	 * Broadcasts or publishes a message to the specified channel
	 * and register a one-time event handler
	 * that gets called when the first answer to the sent message is received.
	 *
	 * Internally it generates a UUID as reply address
	 * that are sent with the message.
	 * The specified callback is registered in the reply handlers
	 * with the generated UUID.
	 *
	 * @param channel channel in which the message is sent
	 * @param message message to send
	 * @param callback the function
	 * that will be called on the first received answer to the sent message
	 * @param headers optional headers sent with the event bus message
	 *
	 * @throws if the event bus is not open
	 *
	 * @see {@link onOpen}
	 *
	 * @see {@link generateUUID}
	 * @see {@link replyHandlers}
	 *
	 * @category Vertx EventBus
	 *
	 * @example ```ts
	 * // some vertx eventbus channel to send to
	 * const channel = 'MY_CHANNEL';
	 *
	 * const eventBus = new EventBus('http://localhost:8081/bridge');
	 *
	 * eventBus.onOpen = () => {
	 *   eventBus.send(channel, 'Ping', (message, err) => {
	 *     console.log('Pong:', message);
	 *   });
	 * };
	 * ```
	 */
	send(
		channel: string,
		message: JSONSerializable,
		callback: Callback,
		headers?: Headers
	) {
		if (this.state !== EventBus.OPEN)
			throw new InvalidSocketStateError(
				EventBus.getStateName(this.state),
				EventBus.getStateName(EventBus.OPEN)
			);

		const replyAddress = EventBus.generateUUID();
		this.replyHandlers[replyAddress] = callback;

		const envelope: SendMessage = {
			type: 'send',
			address: channel,
			headers: headers || {},
			body: message,
			replyAddress
		};

		this.socket.send(EventBus.encodeMessage(envelope));
	}

	/**
	 * Closes the event bus and don't receive any further event bus messages.
	 * The connection will not be re-established automatically,
	 * even if automatic reconnect is enabled.
	 *
	 * @see {@link enableReconnect}
	 *
	 * @category Connection
	 *
	 * @example ```ts
	 * const eventBus = new EventBus('http://localhost:8081/bridge');
	 * // close event bus
	 * eventBus.close();
	 * ```
	 */
	close() {
		console.log('Eventbus will close now!');
		this.enableReconnect(false);
		this.socket.close();
		if (this.reconnectTimerId) clearTimeout(this.reconnectTimerId);
	}

	/**
	 * Generates a unique identifier for an address used as a reply address.
	 * @returns a unique identifier for an address
	 *
	 * @see {@link send}
	 * @see {@link "model/VertxEventBus".Message | Message}
	 *
	 * @category EventBus Internal
	 *
	 * @example ```ts
	 * const replyAddress = EventBus.generateUUID();
	 *
	 * const envelope: Message = {
	 *   type: 'send',
	 *   address: channel,
	 *   headers: headers || {},
	 *   body: message,
	 *   replyAddress
	 * };
	 * ```
	 */
	private static generateUUID(): string {
		let b: number;
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, a => {
			b = Math.random() * 16;
			return (a === 'y' ? (b & 3) | 8 : b | 0).toString(16);
		});
	}

	/**
	 * Encodes a message that is sent to the vertx event bus.
	 * @param message message object to encode
	 * @returns the encoded message
	 *
	 * @see {@link publish}
	 * @see {@link send}
	 *
	 * @category EventBus Internal
	 *
	 * @example ```ts
	 * const message: Message = {
	 *   type: 'publish',
	 *   address: channel,
	 *   headers: headers || {},
	 *   body: message
	 * };
	 *
	 * this.socket.send(EventBus.encodeMessage(message));
	 * ```
	 */
	private static encodeMessage(message: Message): string {
		return JSON.stringify(message);
	}

	/**
	 * Decodes the data received from the vertx event bus to a message object.
	 * @param data data received from the vertx event bus
	 * @returns the decoded message object
	 *
	 * @see {@link setupConnection | setupConnection (here socket.onmessage)}
	 *
	 * @category EventBus Internal
	 *
	 * @example ```ts
	 * // data received from the socket
	 * const data = 'some_data';
	 *
	 * const message = EventBus.decodeMessage(data);
	 * ```
	 */
	private static decodeMessage(data: string): Message {
		return JSON.parse(data) as Message;
	}

	/**
	 * Creates a new web socket with SockJS with the specified options
	 * and registers all needed event handlers to the web socket.
	 *
	 * It automatically tries to connect to the specified url.
	 *
	 * The socket onopen event handler enables continuous ping
	 * and triggers the onReconnect event handler
	 * if a reconnect has happened.
	 *
	 * The socket onclose event handler disables continuous ping,
	 * triggers the onClose event handler
	 * and set the reconnect timeout that creates a new SockJS web socket
	 * if automatic reconnect is enabled.
	 *
	 * The socket onmessage decodes the received message,
	 * add a reply function to the message object if the message is a reply,
	 * check if the message is an error message
	 * and search for event handlers that are registered to the message address.
	 * If handlers are available, call them,
	 * otherwise search for reply handlers
	 * that are registered in the send method before.
	 * If also no reply handlers were found, log an error or output a warning.
	 * Here the backend server sends the client unhandled messages
	 * which indicates a missing unsubscribe from the message channel.
	 *
	 * @param url url the SockJS socket tries to connect to
	 * @param options optional options for the SockJS socket
	 * @returns the web socket from SockJS
	 *
	 * @event onOpen if the web socket is opened
	 * @event onClose if the web socket is closed
	 * @event onReconnect if the web socket has reconnected
	 *
	 * @category EventBus Internal
	 */
	private setupConnection(url: string, options?: SockJS.Options): WebSocket {
		const socket = new SockJS(url, null, options);

		socket.onopen = () => {
			this.enablePing(true);
			this.onOpen && this.onOpen();
			if (that.reconnectTimerId) {
				that.reconnectAttempts = 0;
				that.onReconnect && that.onReconnect();
				// re-subscribe to registered channels
				Object.keys(that.handlers).forEach(channel => {
					that.subscribeToChannel(channel);
				});
			}
		};

		socket.onclose = () => {
			this.enablePing(false);
			this.onClose && this.onClose();
			if (that.pingTimerId) clearInterval(that.pingTimerId);
			if (
				that.reconnectEnabled &&
				that.reconnectAttempts < that.options.reconnectAttempts
			) {
				that.reconnectTimerId = setTimeout(() => {
					that.socket = this.setupConnection(url, options);
				}, that.newReconnectDelay());

				++that.reconnectAttempts;
			}
		};

		const that = this;
		socket.onmessage = function (this: WebSocket, ev: MessageEvent) {
			const message = EventBus.decodeMessage(ev.data) as Message;

			if (message.type === 'rec' || message.type === 'err') {
				// define a reply function on the message itself
				if (message.replyAddress) {
					Object.defineProperty(message, 'reply', {
						value: function (
							message: any,
							callback: Callback,
							headers?: Headers
						) {
							return that.send(
								message.replyAddress,
								message,
								callback,
								headers
							);
						}
					});
				}

				const successMessage = message.type === 'err' ? null : message;
				const errorMessage = message.type === 'err' ? message : null;

				if (that.handlers[message.address]) {
					// iterate of all registered handlers
					that.handlers[message.address].forEach(handler => {
						handler(
							successMessage as ReceiveMessage,
							errorMessage as ErrorMessage
						);
					});
				} else if (that.replyHandlers[message.address]) {
					that.replyHandlers[message.address](
						successMessage as ReceiveMessage,
						errorMessage as ErrorMessage
					);
					// call reply handler only once
					delete that.replyHandlers[message.address];
				} else {
					if (errorMessage) {
						that.onError && that.onError(errorMessage as ErrorMessage);
					}
					console.warn('No handler found for message: ', successMessage);
				}
			} else {
				console.warn('Unknown message type received:', message);
			}
		};

		return socket;
	}

	/**
	 * Send a ping message to the backend server
	 * if the connection is open
	 * to prove the backend server that the client is still connected
	 * and has not lost connection.
	 *
	 * @see {@link WebSocket}
	 * @see {@link "model/VertxEventBus".Message | Message}
	 *
	 * @category EventBus Internal
	 *
	 * @example ```ts
	 * if (enable && pingInterval > 0) {
	 *   this.sendPing();
	 *   this.pingTimerId = setInterval(() => {
	 *     this.sendPing();
	 *   }, pingInterval);
	 * }
	 * ```
	 */
	private sendPing() {
		if (this.state === EventBus.OPEN) {
			this.socket.send(EventBus.encodeMessage({ type: 'ping' }));
		}
	}

	/**
	 * Calculate a new reconnect delay
	 * after the event bus tries to reconnect to the backend server
	 * if automatic reconnect is enabled.
	 *
	 * The return value are between the minimum and maximum delay
	 * and increases with increasing reconnect attempts
	 * based on a power function.
	 *
	 * It multiplies the minimal delay with a power function
	 * that has as base the current reconnect attempts
	 * and as exponent the in the options defined exponent
	 * to determine a new delay time.
	 * Then a random number between 0 and 1 is generated
	 * which is multiplied to the randomization factor
	 * that describes the deviation from calculated delay time.
	 * Now the deviation is added or subtracted to calculated delay time
	 * based on the random factor.
	 * Finally the minimum of the delay time
	 * and the maximum delay time is returned.
	 *
	 * @returns a new reconnect delay in milliseconds
	 *
	 * @see {@link "model/VertxEventBus".Options | Options}
	 * @see {@link reconnectAttempts}
	 * @see {@link setupConnection | setupConnection (here socket.onclose)}
	 *
	 * @category EventBus Internal
	 *
	 * @example ```ts
	 * if (
	 *   this.reconnectEnabled &&
	 *   this.reconnectAttempts < this.options.reconnectAttempts
	 * ) {
	 *   this.reconnectTimerId = setTimeout(() => {
	 *     this.socket = this.setupConnection(url, options);
	 *   }, this.newReconnectDelay());
	 *
	 *   ++this.reconnectAttempts;
	 * }
	 * ```
	 */
	private newReconnectDelay() {
		let ms =
			this.options.delayMin *
			Math.pow(this.options.reconnectExponent, this.reconnectAttempts);
		if (this.options.randomizationFactor) {
			const rand = Math.random();
			const deviation = Math.floor(
				rand * this.options.randomizationFactor * ms
			);
			ms = (Math.floor(rand * 10) & 1) === 0 ? ms - deviation : ms + deviation;
		}
		return Math.min(ms, this.options.delayMax) | 0;
	}

	/**
	 * Send a register message to the backend server
	 * if the connection is open
	 * to receive all messages from the vertx event bus
	 * via the backend server.
	 * @param channel channel to register or subscribe to
	 * @param headers optional headers sent with the event bus message
	 *
	 * @see {@link WebSocket}
	 * @see {@link "model/VertxEventBus".Message | Message}
	 *
	 * @category EventBus Internal
	 *
	 * @example ```ts
	 * if (!this.handlers[channel]) {
	 *   this.handlers[channel] = [];
	 *   // First handler for this address so we should register the connection
	 *   this.subscribeToChannel(channel, headers);
	 * }
	 * ```
	 */
	private subscribeToChannel(channel: string, headers?: Headers) {
		if (this.state === EventBus.OPEN) {
			this.socket.send(
				EventBus.encodeMessage({
					type: 'register',
					address: channel,
					headers: headers || {}
				})
			);
		}
	}

	/**
	 * Send a unregister message to the backend server
	 * if the connection is open
	 * to cancel the subscription
	 * to all further messages on the specified channel.
	 * @param channel channel to unregister or unsubscribe from
	 * @param headers optional headers sent with the event bus message
	 *
	 * @see {@link WebSocket}
	 * @see {@link "model/VertxEventBus".Message | Message}
	 *
	 * @category EventBus Internal
	 *
	 * @example ```ts
	 * if (newHandlers.length === 0) {
	 *   delete this.handlers[channel];
	 *   // No more local handlers so we should unregister the connection
	 *   this.unsubscribeFromChannel(channel, headers);
	 * }
	 * ```
	 */
	private unsubscribeFromChannel(channel: string, headers?: Headers) {
		if (this.state === EventBus.OPEN) {
			this.socket.send(
				EventBus.encodeMessage({
					type: 'unregister',
					address: channel,
					headers: headers || {}
				})
			);
		}
	}
}
