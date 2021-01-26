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
 */
import SockJS from 'sockjs-client';

import { Options } from './options';
import { getLogger } from './logger';
import { defaultOptions } from './vertx-event-bus-default-options';
import {
	Callback,
	ErrorMessage,
	Headers,
	JsonSerializable,
	Message,
	PublishMessage,
	SendMessage
} from './messages';

const logger = getLogger('Vert.x Eventbus');

/**
 * An eventbus connector for the vertx environment.
 *
 * It implements the Javascript client-side of the SockJS event bus bridge
 * based on the online documentation by the Vert.x-Team
 * and their implementation:
 * - https://vertx.io/docs/vertx-web/java/#_sockjs_event_bus_bridge
 * - https://github.com/vert-x3/vertx-web/blob/master/vertx-web/src/client/vertx-eventbus.js
 *
 * @see https://vertx.io/
 */
export class EventBus {
	/**
	 * the state if the eventbus is currently connecting to the server
	 *
	 * @see {@link EventBus.state}
	 * @see {@link EventBus.getStateName}
	 */
	static get CONNECTING(): typeof WebSocket.CONNECTING {
		return WebSocket.CONNECTING;
	}

	/**
	 * the state if the eventbus is currently open
	 * and ready to handle incoming messages and send messages
	 *
	 * @see {@link EventBus.state}
	 * @see {@link EventBus.getStateName}
	 */
	static get OPEN(): typeof WebSocket.OPEN {
		return WebSocket.OPEN;
	}

	/**
	 * the state if the eventbus is currently closing
	 * and no further messages are handled
	 *
	 * @see {@link EventBus.state}
	 * @see {@link EventBus.getStateName}
	 */
	static get CLOSING(): typeof WebSocket.CLOSING {
		return WebSocket.CLOSING;
	}

	/**
	 * the state if the eventbus is currently closed
	 * and cannot send and receive anything
	 *
	 * @see {@link EventBus.state}
	 * @see {@link EventBus.getStateName}
	 */
	static get CLOSED(): typeof WebSocket.CLOSED {
		return WebSocket.CLOSED;
	}

	/**
	 * Returns a human readable state name for the given eventbus state.
	 * @param stateId - the eventbus state to translate
	 * @returns a human readable state name
	 *
	 * @see {@link EventBus.state}
	 *
	 * @example
	 * ```ts
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
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
	 * @see {@link Options}
	 * @see {@link (EventBus:constructor) | EventBus Constructor}
	 *
	 * @example
	 * ```ts
	 * // set ping interval to 2 seconds
	 * const eventBus = new EventBus('http://localhost:9870/bridge', {
	 * 	pingInterval: 2000
	 * });
	 *
	 * // read ping interval
	 * console.log('Ping interval: ', eventBus.options.pingInterval);
	 * ```
	 */
	readonly options: Required<Options>;

	/**
	 * the web socket managed by the eventbus.
	 *
	 * This is the eventbus
	 * where the eventbus bridge packages are being sent and received
	 * when the web socket is open.
	 *
	 * @see {@link EventBus.decodeMessage}
	 * @see {@link EventBus.encodeMessage}
	 *
	 * @example
	 * ```ts
	 * // send a ping through the socket
	 * this.socket.send(EventBus.encodeMessage({ type: 'ping' }));
	 *
	 * // all methods and accessors of the web socket are available
	 * this.socket.onmessage = function (this: WebSocket, ev: EventMessage) {
	 * 	const message = EventBus.decodeMessage(ev.data);
	 * 	console.log('Received message:', message);
	 * }
	 * ```
	 */
	private socket: WebSocket;

	/**
	 * an object that stores all registered event handlers
	 * registered via the registerHandler method
	 *
	 * The object contains, with the channel as key, arrays
	 * containing callbacks listening to that channel
	 *
	 * If no callback is listening to a specific channel,
	 * the entire key-value pair gets deleted.
	 *
	 * @see {@link EventBus.registerHandler}
	 * @see {@link EventBus.unregisterHandler}
	 * @see {@link EventBus.setupConnection}
	 *
	 * @example
	 * ```ts
	 * // some event bus channel
	 * const channel = 'CHANNEL_ADDRESS';
	 *
	 * // some message and error message
	 * const successMessage = { type: 'rec', body: {} };
	 * const errorMessage = null;
	 *
	 * // check if channel is available
	 * if (this.handlers[channel]) {
	 * 	// iterate of all registered handlers
	 * 	that.handlers[message.address].forEach(handler => {
	 * 		handler(
	 * 			successMessage as SuccessMessage,
	 * 			errorMessage as ErrorMessage
	 * 		);
	 * 	});
	 * }
	 * ```
	 */
	private readonly handlers: { [key: string]: Array<Callback> };

	/**
	 * an object that stores a specific callback for a reply message
	 * requested using the `send` function.
	 *
	 * @see {@link EventBus.send}
	 * @see {@link EventBus.setupConnection}
	 *
	 * @example
	 * ```ts
	 * // some message
	 * const message = { type: 'rec', address: 'SOME_UUID' body: {} };
	 *
	 * // some message and error message
	 * const successMessage = { type: 'rec', address: 'SOME_UUID' body: {} };
	 * const errorMessage = null;
	 *
	 * // check if channel is available
	 * if (this.replyHandlers[message.address]) {
	 * 	this.replyHandlers[message.address](
	 * 		successMessage as SuccessMessage,
	 * 		errorMessage as ErrorMessage
	 *	);
	 * 	// call reply handler only once
	 * 	delete that.replyHandlers[message.address];
	 * }
	 * ```
	 */
	private readonly replyHandlers: { [key: string]: Callback };

	/**
	 * stores pending messages if the eventbus connection is currently closed
	 *
	 * @see {@link EventBus.publish}
	 * @see {@link EventBus.send}
	 * @see {@link EventBus.setupConnection}
	 *
	 * @example
	 * ```ts
	 * // some message
	 * const message = { type: 'rec', address: 'SOME_UUID' body: {} };
	 *
	 * if (this.state !== EventBus.OPEN) {
	 * 	// eventbus closed -> store
	 * 	this.pendingMessages.push(message);
	 * } else {
	 * 	// eventbus open -> send directly
	 * 	this.sendMessage(message);
	 * }
	 * ```
	 */
	private pendingMessages: Array<Message>;

	/**
	 * the ping timer id generated by a `setInterval()`
	 *
	 * If pinging is enabled, this stores the current ping timer id.
	 * Otherwise, it is `null`.
	 *
	 * @see {@link NodeJS.Timeout}
	 * @see {@link EventBus.setInterval}
	 * @see {@link EventBus.enablePing}
	 * @see {@link EventBus.options}
	 *
	 * @example
	 * ```ts
	 * // get ping interval from options
	 * const { pingInterval } = this.options;
	 *
	 * if (this.pingTimerId) clearInterval(this.pingTimerId);
	 * this.pingTimerId = setInterval(() => {
	 * 	this.sendPing();
	 * }, pingInterval);
	 * ```
	 */
	private pingTimerId?: NodeJS.Timeout;

	/**
	 * the reconnect timer id generated by `setTimeout()`
	 *
	 * It stores the current reconnect timer id if:
	 * - the web socket has closed unexpectedly **and**
	 * - automatic reconnect is enabled **and**
	 * - the reconnect attempts specified in the options are not reached
	 *
	 * otherwise, it is `null`.
	 *
	 * @see {@link NodeJS.Timeout}
	 * @see {@link setTimeout}
	 * @see {@link EventBus.setupConnection | setupConnection (here socket.onclose)}
	 * @see {@link EventBus.reconnectEnabled}
	 * @see {@link EventBus.reconnectAttempts}
	 * @see {@link EventBus.newReconnectDelay}
	 *
	 * @example
	 * ```ts
	 * if (this.pingTimerId) clearInterval(this.pingTimerId);
	 * if (
	 * 	this.reconnectEnabled &&
	 * 	this.reconnectAttempts < this.options.reconnectAttempts
	 * ) {
	 * 	this.reconnectTimerId = setTimeout(() => {
	 * 		this.socket = this.setupConnection(url, options);
	 * 		}, this.newReconnectDelay());
	 *
	 * 	this.reconnectAttempts++;
	 * }
	 * ```
	 */
	private reconnectTimerId?: NodeJS.Timeout;

	/**
	 * `true` if automatic reconnect is enabled; otherwise: `false`
	 *
	 * is set in enableReconnect
	 * and used in setupConnections, especially in socket.onclose
	 *
	 * If automatic reconnect is enabled,
	 * the event bus tries to reconnect to the backend server
	 * in increasing intervals until the connection gets re-established.
	 *
	 * @see {@link EventBus.enableReconnect}
	 * @see {@link EventBus.setupConnection | setupConnection (here socket.onclose)}
	 * @see {@link EventBus.reconnectTimerId}
	 * @see {@link EventBus.newReconnectDelay}
	 *
	 * @example
	 * ```ts
	 * if (this.reconnectEnabled) {
	 * 	this.reconnectTimerId = setTimeout(() => {
	 * 		this.socket = this.setupConnection(url, options);
	 * 	}, this.newReconnectDelay());
	 *
	 * 	this.reconnectAttempts++;
	 * }
	 * ```
	 */
	private reconnectEnabled: boolean;

	/**
	 * number of reconnect attempts after loss of communication
	 * via the web socket
	 *
	 * resets to `0` if reconnect was successful
	 *
	 * @see {@link EventBus.reconnectEnabled}
	 * @see {@link EventBus.setupConnection | setupConnection (here socket.onclose)}
	 * @see {@link EventBus.reconnectTimerId}
	 * @see {@link EventBus.newReconnectDelay}
	 *
	 * @example
	 * ```ts
	 * if (this.reconnectEnabled) {
	 * 	this.reconnectTimerId = setTimeout(() => {
	 * 		this.socket = this.setupConnection(url, options);
	 * 	}, this.newReconnectDelay());
	 *
	 * 	this.reconnectAttempts++;
	 * }
	 * ```
	 */
	private reconnectAttempts: number;

	/**
	 * the server url the event bus is connected to
	 *
	 * @see {@link (EventBus:constructor) | EventBus Constructor}
	 *
	 * @example
	 * ```ts
	 * const eb = new EventBus('http://localhost:9870/bridge');
	 *
	 * console.log(eb.serverUrl); // 'http://localhost:9870/bridge'
	 * ```
	 */
	readonly serverUrl: string;

	/**
	 * the current number of received messages through the eventbus connection
	 *
	 * @see {@link EventBus.setupConnection | setupConnection (here socket.onmessage)}
	 *
	 * @example
	 * ```ts
	 * const eb = new EventBus('http://localhost:9870/bridge');
	 *
	 * eb.onOpen = () => {
	 * 	console.log(eb.messageCount); // 0
	 * 	eb.send('awesome-channel', 'Hello World!');
	 * 	console.log(eb.messageCount); // 1
	 * };
	 * ```
	 */
	messageCount: number;

	/**
	 * an event listener that gets called when:
	 * - the event bus is opened
	 * - the event bus has reconnected after a connection loss
	 *
	 * @see {@link EventBus.setupConnection | setupConnection (here socket.onopen)}
	 * @see {@link (EventBus:constructor) | EventBus Constructor}
	 *
	 * @example
	 * ```ts
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
	 *
	 * eventBus.onOpen = () => {
	 * 	console.log('Event bus has opened');
	 * };
	 *
	 * // on connection is open or successful reconnect
	 * // -> 'Event bus has opened'
	 * ```
	 */
	onOpen?: () => void;

	/**
	 * an event listener that gets called
	 * - when the event bus is closed
	 * - when the event bus has lost the connection
	 * - after an automatic reconnect failure
	 *
	 * @see {@link EventBus.enableReconnect}
	 * @see {@link (EventBus:constructor) | EventBus Constructor}
	 * @see {@link EventBus.setupConnection | setupConnection (here socket.onclose)}
	 *
	 * @example
	 * ```ts
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
	 * // enable automatic reconnect
	 * const eventBus.enableReconnect(true);
	 *
	 * eventBus.onClose = () => {
	 * 	console.log('Event bus has lost connection');
	 * };
	 *
	 * // on connection loss or reconnect failure
	 * // -> 'Event bus has lost connection'
	 * ```
	 */
	onClose?: () => void;

	/**
	 * an event listener that gets called when:
	 * - the event bus has reconnected if automatic reconnect is enabled
	 *
	 * @see {@link EventBus.enableReconnect}
	 * @see {@link (EventBus:constructor) | EventBus Constructor}
	 * @see {@link EventBus.setupConnection | setupConnection (here socket.onopen)}
	 *
	 * @example
	 * ```ts
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
	 * // enable automatic reconnect
	 * const eventBus.enableReconnect(true);
	 *
	 * eventBus.onReconnect = () => {
	 * 	console.log('Event bus has reconnected after a connection loss');
	 * };
	 *
	 * // on successful reconnect
	 * // -> 'Event bus has reconnected after a connection loss'
	 * ```
	 */
	onReconnect?: () => void;

	/**
	 * an event listener that gets called when:
	 * - the connection is open and an error message is received via the socket
	 *
	 * In its default configuration, it logs the error message to the console
	 * with `console.error()`.
	 *
	 * @see {@link (EventBus:constructor) | EventBus Constructor}
	 * @see {@link EventBus.setupConnection | setupConnection (here socket.onmessage)}
	 *
	 * @example
	 * ```ts
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
	 *
	 * eventBus.onError = (err) => {
	 * 	console.log('Received error message:', err);
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
	 * and falls back on default options if some of the given options are not set.
	 *
	 * @param url - the server url
	 * @param options - event bus configuration options
	 *
	 * @see {@link EventBus.onOpen}
	 * @see {@link EventBus.publish}
	 *
	 * @example
	 * ```ts
	 * // some vertx event bus channel
	 * const channel = 'EVENTBUS_CHANNEL';
	 *
	 * // build a new event bus instance
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
	 * // set an event listener when the the event bus is open
	 * eventBus.onOpen = () => {
	 * 	// publish a simple message to the event bus
	 * 	eventBus.publish(channel, 'Hello World');
	 * };
	 * ```
	 */
	constructor(url: string, options?: Partial<Options>) {
		this.options = { ...defaultOptions, ...options };
		this.handlers = {};
		this.replyHandlers = {};
		this.pendingMessages = [];
		this.reconnectEnabled = false;
		this.reconnectAttempts = 0;
		this.serverUrl = url;
		this.messageCount = 0;
		this.onError = errorMessage => {
			logger.error('Received error message:', errorMessage);
		};

		this.socket = this.setupConnection(url);
	}

	/**
	 * Returns the current state of the event bus.
	 * Currently, this can be connecting, open, closing and closed.
	 *
	 * It can be compared to the event bus state accessors
	 * and can be converted into a human readable string with getStateName.
	 *
	 * @see {@link EventBus.CONNECTING}
	 * @see {@link EventBus.OPEN}
	 * @see {@link EventBus.CLOSING}
	 * @see {@link EventBus.CLOSED}
	 * @see {@link EventBus.getStateName}
	 *
	 * @example
	 * ```ts
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
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
	 * Returns `true` if ping is enabled. Otherwise, it returns `false`.
	 *
	 * @see {@link EventBus.enablePing}
	 * @see {@link EventBus.pingTimerId}
	 *
	 * @example
	 * ```ts
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
	 *
	 * eventBus.onOpen = () => {
	 * 	console.log(eventBus.isPingEnabled);
	 * 	// -> 'true'
	 * }
	 * ```
	 */
	get isPingEnabled(): boolean {
		return !!this.pingTimerId;
	}

	/**
	 * Returns `true` if automatic reconnect is enabled.
	 * Otherwise, it returns `false`.
	 *
	 * @see {@link EventBus.enableReconnect}
	 * @see {@link EventBus.reconnectEnabled}
	 *
	 * @example
	 * ```ts
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
	 *
	 * eventBus.onOpen = () => {
	 * 	console.log(eventBus.isReconnectEnabled);
	 * 	// -> 'false'
	 * 	eventBus.enableReconnect(true);
	 * 	console.log(eventBus.isReconnectEnabled);
	 * 	// -> 'true'
	 * }
	 * ```
	 */
	get isReconnectEnabled(): boolean {
		return this.reconnectEnabled;
	}

	/**
	 * Returns the number of reconnection attempts
	 * if the socket has unexpectedly closed
	 * and automatic reconnection is enabled. Otherwise, it returns `0`.
	 *
	 * Resets to `0` if the connection is re-established.
	 *
	 * @see {@link EventBus.reconnectAttempts}
	 * @see {@link EventBus.enableReconnect}
	 *
	 * @example
	 * ```ts
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
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
	 * Enable or disable sending continuous ping messages on an open event bus.
	 *
	 * The ping interval can be defined in the options when creating the event bus.
	 *
	 * It is automatically enabled when the event bus is opened,
	 * and disabled when the event bus is closed.
	 *
	 * **Use with caution!
	 * The backend server closes the connection
	 * if no ping messages are received after a specific timeout!**
	 * @param enable - `true` to enable continuous ping message,
	 * `false` to disable
	 *
	 * @see {@link EventBus.isPingEnabled}
	 * @see {@link Options}
	 * @see {@link EventBus.onOpen}
	 *
	 * @example
	 * ```ts
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
	 *
	 * eventBus.onOpen = () => {
	 * 	// disable ping message send for 1 second
	 * 	eventBus.enablePing(false);
	 * 	setTimeout(() => {
	 * 		eventBus.enablePing(true);
	 * 	}, 1000);
	 * };
	 * ```
	 */
	enablePing(enable: boolean): void {
		const { pingInterval } = this.options;

		if (enable && pingInterval) {
			this.sendPing();
			this.pingTimerId = setInterval(() => {
				this.sendPing();
			}, pingInterval);
		} else if (this.pingTimerId) {
			clearInterval(this.pingTimerId);
			this.pingTimerId = undefined;
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
	 * @param enable - true to enable automatic reconnect, false to disable
	 *
	 * @see {@link EventBus.isReconnectEnabled}
	 * @see {@link EventBus.onReconnect}
	 * @see {@link EventBus.newReconnectDelay}
	 *
	 * @example
	 * ```ts
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
	 * // enable automatic reconnect
	 * eventBus.enableReconnect(true);
	 *
	 * eventBus.onReconnect = () => {
	 * 	console.log('Event bus has reconnected');
	 * };
	 * ```
	 */
	enableReconnect(enable: boolean): void {
		this.reconnectEnabled = enable;
		if (!enable && this.reconnectTimerId) {
			clearTimeout(this.reconnectTimerId);
			this.reconnectTimerId = undefined;
			this.reconnectAttempts = 0;
		}
	}

	/**
	 * Register an event handler to the specified channel.
	 *
	 * The given callback is executed when the event bus receives a message
	 * on the specified channel.
	 *
	 * The specified headers are sent with the registration message
	 * that goes to the backend on the first registered event call
	 * for this specified channel.
	 *
	 * If the eventbus is currently closed it stores the callback
	 * and registers it after the connection is open.
	 *
	 * @param channel - the channel on which the event handler
	 * that executes the callback on incoming messages gets registered
	 * @param callback - the function that gets executed
	 * when incoming messages are received on the specified channel
	 * @param headers - optional headers sent with the initial registration
	 * message to the backend on the first register event
	 *
	 * @see {@link EventBus.unregisterHandler}
	 * @see {@link EventBus.onOpen}
	 *
	 * @example
	 * ```ts
	 * // some vertx eventbus channel to register to
	 * const channel = 'MY_CHANNEL';
	 *
	 * // define a handler
	 * const handler: Callback = (message, err) => {
	 * 	if (err) {
	 * 		console.error(err);
	 * 	} else {
	 * 		console.log(message);
	 * 	}
	 * };
	 *
	 * const eventBus = new EventBus('https://localhost:9870/bridge');
	 *
	 * eventBus.onOpen = () => {
	 * 	eventBus.registerHandler(channel, handler);
	 * };
	 *
	 * // later
	 * // unregister handler
	 * eventBus.unregisterHandler(channel, handler);
	 * ```
	 */
	registerHandler(
		channel: string,
		callback: Callback,
		headers?: Headers
	): void {
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
	 * The callback argument must be the same as the one that was registered
	 * using `registerHandler()`.
	 *
	 * The specified headers are sent with the unregister message
	 * that goes to the backend
	 * **if** no other event handlers are registered to this channel anymore.
	 *
	 * @param channel - the channel the event handler unregisters from
	 * @param callback - the callback to unregister from the channel
	 * @param headers - optional headers sent with the last unregister message
	 *
	 * @see {@link EventBus.registerHandler}
	 *
	 * @example
	 * ```ts
	 * // some vertx eventbus channel to register to
	 * const channel = 'MY_CHANNEL';
	 *
	 * // define a handler
	 * const handler: Callback = (message, err) => {
	 * 	if (err) {
	 * 		console.error(err);
	 * 	} else {
	 * 		console.log(message);
	 * 	}
	 * };
	 *
	 * const eventBus = new EventBus('https://localhost:9870/bridge');
	 *
	 * eventBus.onOpen = () => {
	 * 	eventBus.registerHandler(channel, handler);
	 * };
	 *
	 * // later
	 * // unregister handler
	 * eventBus.unregisterHandler(channel, handler);
	 * ```
	 */
	unregisterHandler(
		channel: string,
		callback: Callback,
		headers?: Headers
	): void {
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
	 * Broadcasts or publishes a message on the specified channel.
	 *
	 * If the eventbus is currently closed it stores the message
	 * and publishes it after the connection is open.
	 *
	 * @param channel - channel to which the message gets published
	 * @param message - the message
	 * that will be broadcasted on the specified channel
	 * @param headers - optional headers sent with the event bus message
	 *
	 * @see {@link EventBus.onOpen}
	 *
	 * @example
	 * ```ts
	 * // some vertx eventbus channel to publish to
	 * const channel = 'MY_CHANNEL';
	 *
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
	 *
	 * eventBus.onOpen = () => {
	 * 	eventBus.publish(channel, 'Hey there!');
	 * }
	 * ```
	 */
	publish(channel: string, message: JsonSerializable, headers?: Headers): void {
		// assemble
		const envelope: PublishMessage = {
			type: 'publish',
			address: channel,
			headers: headers || {},
			body: message
		};

		if (this.state !== EventBus.OPEN) {
			// connection currently closed -> store message
			this.pendingMessages.push(envelope);
		} else {
			// connection open -> send immediate
			this.sendMessage(envelope);
		}
	}

	/**
	 * Broadcasts or publishes a message to the specified channel
	 * and. It also registers a one-time event handler
	 * that gets called when the first answer to the message is received.
	 *
	 * Internally it generates a UUID as reply address
	 * that is sent with the message.
	 * The specified callback is registered in the reply handlers
	 * using the generated UUID.
	 *
	 * @param channel - channel in which the message is sent
	 * @param message - the message that will sent on the specified channel
	 * @param callback - the function
	 * that will get called when the first answer is received
	 * @param headers - optional headers sent with the event bus message
	 *
	 * @see {@link EventBus.onOpen}
	 * @see {@link EventBus.generateUUID}
	 * @see {@link EventBus.replyHandlers}
	 *
	 * @example
	 * ```ts
	 * // some vertx eventbus channel to send to
	 * const channel = 'MY_CHANNEL';
	 *
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
	 *
	 * eventBus.onOpen = () => {
	 * 	eventBus.send(channel, 'Ping', (message, err) => {
	 * 		console.log('Pong:', message);
	 * 	});
	 * };
	 * ```
	 */
	send(
		channel: string,
		message: JsonSerializable,
		callback: Callback,
		headers?: Headers
	): void {
		const replyAddress = EventBus.generateUUID();
		this.replyHandlers[replyAddress] = callback;

		const envelope: SendMessage = {
			type: 'send',
			address: channel,
			headers: headers || {},
			body: message,
			replyAddress
		};

		if (this.state !== EventBus.OPEN) {
			// connection currently closed -> store message
			this.pendingMessages.push(envelope);
		} else {
			// connection open -> send immediate
			this.sendMessage(envelope);
		}
	}

	/**
	 * Close the event bus and stop receiving any further event bus messages.
	 * The connection will not be re-established automatically,
	 * even if automatic reconnect is enabled.
	 *
	 * @see {@link EventBus.enableReconnect}
	 *
	 * @example
	 * ```ts
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
	 * // close event bus
	 * eventBus.close();
	 * ```
	 */
	close(): void {
		this.enableReconnect(false);
		this.socket.close();
		if (this.reconnectTimerId) clearTimeout(this.reconnectTimerId);
	}

	/**
	 * Generates a unique identifier for an address used as a reply address.
	 * @returns a unique identifier for an address
	 *
	 * @see {@link EventBus.send}
	 * @see {@link Message}

	 *
	 * @example
	 * ```ts
	 * const replyAddress = EventBus.generateUUID();
	 *
	 * const envelope: Message = {
	 * 	type: 'send',
	 * 	address: channel,
	 * 	headers: headers || {},
	 * 	body: message,
	 * 	replyAddress
	 * };
	 * ```
	 */
	private static generateUUID(): string {
		let b: number;
		// noinspection SpellCheckingInspection
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, a => {
			b = Math.random() * 16;
			// eslint-disable-next-line no-bitwise
			return (a === 'y' ? (b & 3) | 8 : b | 0).toString(16);
		});
	}

	/**
	 * Encodes a message that is sent to the vertx event bus.
	 * @param message - a valid message that will be encoded
	 * to be sent on the event bus
	 * @returns the encoded message
	 *
	 * @see {@link EventBus.publish}
	 * @see {@link EventBus.send}
	 *
	 * @example
	 * ```ts
	 * const message: Message = {
	 * 	type: 'publish',
	 * 	address: channel,
	 * 	headers: headers || {},
	 * 	body: message
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
	 * @param data - the data received from the vertx event bus
	 * @returns the decoded message object
	 *
	 * @see {@link EventBus.setupConnection | setupConnection (here socket.onmessage)}
	 *
	 * @example
	 * ```ts
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
	 * Creates a new web socket using SockJS with the specified options
	 * and registers all needed event handlers to the web socket.
	 *
	 * It automatically tries to connect to the specified URL.
	 *
	 * Events:
	 *
	 * - {@link EventBus.onOpen} - if the web socket is opened
	 * - {@link EventBus.onClose} - if the web socket is closed
	 * - {@link EventBus.onReconnect} - if the web socket has reconnected
	 *
	 * @param url - url the SockJS socket tries to connect to
	 * @param options - optional options for the SockJS socket
	 * @returns the web socket from SockJS
	 *
	 * @example
	 * ```ts
	 * constructor(url: string) {
	 * 	this.socket = this.setupConnection(url);
	 * }
	 * ```
	 */
	private setupConnection(url: string, options?: Partial<Options>): WebSocket {
		const socket: any = new SockJS(url, null, options);

		// The socket onopen event handler enables continuous ping,
		// registers to subscribed events,
		// send pending messages and triggers the onReconnect event handler
		// if a reconnect has happened.
		socket.onopen = () => {
			this.enablePing(true);
			// subscribe to registered channels
			Object.keys(this.handlers).forEach(channel => {
				this.subscribeToChannel(channel);
			});
			// send pending messages
			this.pendingMessages.forEach(message => {
				this.sendMessage(message);
			});
			// inform subscribers
			if (this.onOpen) {
				this.onOpen();
			}
			if (this.reconnectTimerId) {
				this.reconnectAttempts = 0;
				if (this.onReconnect) {
					this.onReconnect();
				}
			}
		};

		// The socket onclose event handler disables continuous ping,
		// triggers the onClose event handler
		// and set the reconnect timeout that creates a new SockJS web socket
		// if automatic reconnect is enabled.
		socket.onclose = () => {
			// clear up ping
			this.enablePing(false);
			if (this.pingTimerId) clearInterval(this.pingTimerId);
			// inform subscriber
			if (this.onClose) {
				this.onClose();
			}
			// set up automatic reconnection
			if (
				this.reconnectEnabled &&
				this.reconnectAttempts < this.options.reconnectAttempts
			) {
				this.reconnectTimerId = setTimeout(() => {
					this.socket = this.setupConnection(url, options);
				}, this.newReconnectDelay());

				this.reconnectAttempts++;
			}
		};

		const that = this;
		// The socket onmessage decodes the received message,
		// add a reply function to the message object if the message is a reply,
		// check if the message is an error message
		// and search for event handlers that are registered to the message address.
		// If handlers are available, call them,
		// otherwise search for reply handlers
		// that are registered in the send method before.
		// If also no reply handlers were found, log an error or output a warning.
		// Here the backend server sends the client unhandled messages
		// which indicates a missing unsubscribe from the message channel.
		socket.onmessage = function handleMessage(
			this: WebSocket,
			ev: MessageEvent
		) {
			const message = EventBus.decodeMessage(ev.data);
			that.messageCount++;

			if (message.type === 'rec' || message.type === 'err') {
				// define a reply function on the message itself
				if (message.replyAddress) {
					Object.defineProperty(message, 'reply', {
						value(replyMessage: any, callback: Callback, headers?: Headers) {
							return that.send(
								replyMessage.replyAddress,
								replyMessage,
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
						handler(successMessage, errorMessage);
					});
				} else if (that.replyHandlers[message.address]) {
					that.replyHandlers[message.address](successMessage, errorMessage);
					// call reply handler only once
					delete that.replyHandlers[message.address];
				} else {
					if (errorMessage) {
						if (that.onError) {
							that.onError(errorMessage);
						}
					}
					logger.warn('No handler found for message: ', successMessage);
				}
			} else {
				logger.warn('Unknown message type received:', message);
			}
		};

		return socket;
	}

	/**
	 * Send a ping message to the backend server
	 * if the connection is open
	 * to prove to the backend server that the client is still connected.
	 *
	 * @see {@link WebSocket}
	 * @see {@link Message}
	 *
	 * @example
	 * ```ts
	 * if (enable && pingInterval > 0) {
	 * 	this.sendPing();
	 * 	this.pingTimerId = setInterval(() => {
	 * 		this.sendPing();
	 * 	}, pingInterval);
	 * }
	 * ```
	 */
	private sendPing(): void {
		if (this.state === EventBus.OPEN) {
			this.socket.send(EventBus.encodeMessage({ type: 'ping' }));
		}
	}

	/**
	 * Send a registration message to the backend server
	 * to receive all messages of that channel from the vertx event bus.
	 * @param channel - the channel to register or subscribe to
	 * @param headers - optional headers sent in the event bus message
	 *
	 * @see {@link WebSocket}
	 * @see {@link Message}
	 *
	 * @example
	 * ```ts
	 * if (!this.handlers[channel]) {
	 * 	this.handlers[channel] = [];
	 * 	// First handler for this address so we should register the connection
	 * 	this.subscribeToChannel(channel, headers);
	 * }
	 * ```
	 */
	private subscribeToChannel(channel: string, headers?: Headers): void {
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
	 * to cancel the subscription
	 * to all future messages on the specified channel.
	 * @param channel - the channel to unregister or unsubscribe from
	 * @param headers - optional headers sent in the event bus message
	 *
	 * @see {@link WebSocket}
	 * @see {@link Message}
	 *
	 * @example
	 * ```ts
	 * if (newHandlers.length === 0) {
	 * 	delete this.handlers[channel];
	 * 	// No more local handlers so we should unregister the connection
	 * 	this.unsubscribeFromChannel(channel, headers);
	 * }
	 * ```
	 */
	private unsubscribeFromChannel(channel: string, headers?: Headers): void {
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

	/**
	 * Send the given message to the backend server.
	 * @param message - the message that will be sent
	 *
	 * @see {@link WebSocket}
	 * @see {@link Message}
	 *
	 * @example
	 * ```ts
	 * const envelope: PublishMessage = {
	 * 	type: 'publish',
	 * 	address: channel,
	 * 	headers: headers || {},
	 * 	body: message
	 * };
	 *
	 * this.sendMessage(envelope);
	 * ```
	 */
	private sendMessage(message: Message): void {
		if (this.state === EventBus.OPEN) {
			this.socket.send(EventBus.encodeMessage(message));
		}
	}

	/**
	 * Calculate a new reconnect delay
	 * after the event bus tries to reconnect to the backend server
	 * if automatic reconnect is enabled.
	 *
	 * @returns a new reconnect delay in milliseconds
	 * which is in the range of minimum delay
	 * and maximum delay and increases
	 * with increasing reconnect attempts based on a power function.
	 *
	 * @see {@link Options}
	 * @see {@link EventBus.reconnectAttempts}
	 * @see {@link EventBus.setupConnection | setupConnection (here socket.onclose)}
	 *
	 * @example
	 * ```ts
	 * if (
	 * 	this.reconnectEnabled &&
	 * 	this.reconnectAttempts < this.options.reconnectAttempts
	 * ) {
	 * 	this.reconnectTimerId = setTimeout(() => {
	 * 		this.socket = this.setupConnection(url, options);
	 * 	}, this.newReconnectDelay());
	 *
	 * 	this.reconnectAttempts++;
	 * }
	 * ```
	 */
	private newReconnectDelay(): number {
		// It multiplies the minimal delay with a power function
		// that has as base the current reconnect attempts
		// and as exponent the in the options defined exponent
		// to determine a new delay time.
		// Then a random number between 0 and 1 is generated
		// which is multiplied to the randomization factor
		// that describes the deviation from calculated delay time.
		// Now the deviation is added or subtracted to calculated delay time
		// based on the random factor.
		// Finally the minimum of the delay time
		// and the maximum delay time is returned.
		let ms =
			this.options.delayMin *
			this.options.reconnectExponent ** this.reconnectAttempts;
		if (this.options.randomizationFactor) {
			const rand = Math.random();
			const deviation = Math.floor(
				rand * this.options.randomizationFactor * ms
			);
			// eslint-disable-next-line no-bitwise
			ms = (Math.floor(rand * 10) & 1) === 0 ? ms - deviation : ms + deviation;
		}
		// eslint-disable-next-line no-bitwise
		return Math.min(ms, this.options.delayMax) | 0;
	}
}
