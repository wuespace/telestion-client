/*
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
 */

import SockJS from 'sockjs-client';
import {
	Callback,
	Options,
	Message,
	Headers,
	AddressableMessage,
	ErrorMessage,
	SuccessMessage
} from '../model/VertxEventBus';
import InvalidSocketStateError from './InvalidSocketStateError';

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
	 * @see {@link "model/VertxEventBus".Options}
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
	 * The web socket managed by the eventbus and not accessible to the outside.
	 *
	 * Here are the eventbus bridge packages sent and received
	 * if the web socket is open.
	 *
	 * @see {@link "lib.dom".WebSocket}
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
	 * @see {@link "model/VertxEventBus".Callback}
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
	 * @see {@link "model/VertxEventBus".Callback}
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
	 * that stores the current ping timer id if pinging is enabled otherwise null
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
	 * that stores the current reconnect timer
	 * if the web socket has unexpectedly closed, automatic reconnect is enabled
	 * and the reconnect attempts specified in the options are not reached
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
	 * number of reconnect attempts after lost of communication
	 * via the web socket if automatic reconnect is enabled
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
	 * - has reconnected after a connection lost
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
	 * // on connection lost or reconnect failure
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
	 *   console.log('Event bus has reconnected after a connection lost');
	 * };
	 *
	 * // on successful reconnect
	 * // -> 'Event bus has reconnected after a connection lost'
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
	 * @see {@link "model/VertxEventBus".ErrorMessage}
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

	get isPingEnabled(): boolean {
		return !!this.pingTimerId;
	}

	get isReconnectionEnabled(): boolean {
		return this.reconnectEnabled;
	}

	get reconnectionAttempts(): number {
		return this.reconnectAttempts;
	}

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

	enableReconnect(enable: boolean) {
		this.reconnectEnabled = enable;
		if (!enable && this.reconnectTimerId) {
			clearTimeout(this.reconnectTimerId);
			this.reconnectTimerId = null;
			this.reconnectAttempts = 0;
		}
	}

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

	publish(channel: string, message: any, headers?: Headers) {
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

	send(channel: string, message: any, callback: Callback, headers?: Headers) {
		if (this.state !== EventBus.OPEN)
			throw new InvalidSocketStateError(
				EventBus.getStateName(this.state),
				EventBus.getStateName(EventBus.OPEN)
			);

		const replyAddress = EventBus.generateUUID();
		this.replyHandlers[replyAddress] = callback;

		const envelope: Message = {
			type: 'send',
			address: channel,
			headers: headers || {},
			body: message,
			replyAddress
		};

		this.socket.send(EventBus.encodeMessage(envelope));
	}

	close() {
		console.log('Eventbus will close now!');
		this.enableReconnect(false);
		this.socket.close();
		if (this.reconnectTimerId) clearTimeout(this.reconnectTimerId);
	}

	private static generateUUID() {
		let b: number;
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, a => {
			b = Math.random() * 16;
			return (a === 'y' ? (b & 3) | 8 : b | 0).toString(16);
		});
	}

	private static encodeMessage(message: Message): string {
		return JSON.stringify(message);
	}

	private static decodeMessage(data: string): Message {
		return JSON.parse(data) as Message;
	}

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
			const message = EventBus.decodeMessage(ev.data) as AddressableMessage;

			// define a reply function on the message itself
			if (message.replyAddress) {
				Object.defineProperty(message, 'reply', {
					value: function (
						message: any,
						callback: Callback,
						headers?: Headers
					) {
						return that.send(message.replyAddress, message, callback, headers);
					}
				});
			}

			const successMessage = message.type === 'err' ? null : message;
			const errorMessage = message.type === 'err' ? message : null;

			if (that.handlers[message.address]) {
				// iterate of all registered handlers
				that.handlers[message.address].forEach(handler => {
					handler(
						successMessage as SuccessMessage,
						errorMessage as ErrorMessage
					);
				});
			} else if (that.replyHandlers[message.address]) {
				that.replyHandlers[message.address](
					successMessage as SuccessMessage,
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
		};

		return socket;
	}

	private sendPing() {
		if (this.state === EventBus.OPEN) {
			this.socket.send(EventBus.encodeMessage({ type: 'ping' }));
		}
	}

	private newReconnectDelay() {
		let ms =
			this.options.delayMin *
			Math.pow(this.options.reconnectExponent, this.reconnectTimerId);
		if (this.options.randomizationFactor) {
			const rand = Math.random();
			const deviation = Math.floor(
				rand * this.options.randomizationFactor * ms
			);
			ms = (Math.floor(rand * 10) & 1) === 0 ? ms - deviation : ms + deviation;
		}
		return Math.min(ms, this.options.delayMax) | 0;
	}

	private subscribeToChannel(channel: string, headers?: Headers) {
		this.socket.send(
			EventBus.encodeMessage({
				type: 'register',
				address: channel,
				headers: headers || {}
			})
		);
	}

	private unsubscribeFromChannel(channel: string, headers?: Headers) {
		this.socket.send(
			EventBus.encodeMessage({
				type: 'unregister',
				address: channel,
				headers: headers || {}
			})
		);
	}
}
