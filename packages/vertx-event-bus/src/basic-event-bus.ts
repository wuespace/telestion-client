/* eslint-disable max-lines */
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
import { Message, Options } from '@wuespace/telestion-client-types';

import { ConnectionState, defaultOptions } from './model';
import { validate, errorMessage, pingMessage } from './lib';

// performance improvement
const rawPing = JSON.stringify(pingMessage());

/**
 * A basic Vert.x Event Bus connector.
 *
 * It supports:
 * - automatic reconnection
 * - store and forward for sent messages
 * - message encoding and decoding
 * - message validation
 */
export class BasicEventBus {
	/**
	 * The options as readonly member for the current event bus instance.
	 *
	 * A merge of the default options and the in the constructor given options
	 * for the event bus instance.
	 *
	 * @see {@link Options}
	 * @see {@link (BasicEventBus:constructor) | BasicEventBus Constructor}
	 *
	 * @example
	 * ```ts
	 * // set ping interval to 2 seconds
	 * const eventBus = new BasicEventBus('http://localhost:9870/bridge', {
	 * 	pingInterval: 2000
	 * });
	 *
	 * // read ping interval
	 * console.log('Ping interval: ', eventBus.options.pingInterval);
	 * ```
	 */
	readonly options: Options;

	/**
	 * The server url the event bus is connected to.
	 *
	 * @see {@link (BasicEventBus:constructor) | BasicEventBus Constructor}
	 *
	 * @example
	 * ```ts
	 * const eb = new BasicEventBus('http://localhost:9870/bridge');
	 *
	 * console.log(eb.url); // 'http://localhost:9870/bridge'
	 * ```
	 */
	readonly url: string;

	/**
	 * Number of reconnect attempts after loss of communication
	 * via the web socket.
	 *
	 * Resets to `0` if a reconnect was successful.
	 *
	 * @see {@link BasicEventBus.options.autoReconnect}
	 * @see {@link BasicEventBus.handleClose}
	 * @see {@link BasicEventBus.reconnectTimer}
	 * @see {@link BasicEventBus.newReconnectDelay}
	 *
	 * @example
	 * ```ts
	 * if (this.reconnectEnabled) {
	 * 	this.reconnectTimer = setTimeout(() => {
	 * 		this.reconnectAttempts++;
	 * 		this.socket = this.newSocket();
	 * 	}, this.newReconnectDelay());
	 * }
	 * ```
	 */
	reconnectAttempts = 0;

	/**
	 * The current number of sent messages to the server..
	 *
	 * @see {@link BasicEventBus.sendRaw}
	 *
	 * @example
	 * ```ts
	 * const eb = new BasicEventBus('http://localhost:9870/bridge');
	 *
	 * eb.onOpen = () => {
	 * 	console.log(eb.sentMessages); // 0
	 * 	eb.send(publishMessage('awesome-channel', 'Hello World!'));
	 * 	console.log(eb.sentMessages); // 1
	 * };
	 * ```
	 */
	sentMessages = 0;

	/**
	 * The current number of received messages from the server.
	 *
	 * @see {@link BasicEventBus.handleMessage}
	 *
	 * @example
	 * ```ts
	 * const eb = new BasicEventBus('http://localhost:9870/bridge');
	 *
	 * eb.onOpen = () => {
	 * 	console.log(eb.receivedMessages); // 0
	 * };
	 *
	 * eb.onMessage = message => {
	 * 	console.log(eb.receivedMessages); // 1
	 * };
	 * ```
	 */
	receivedMessages = 0;

	/**
	 * Controls the automatic reconnection feature.
	 * When `true` the basic event bus tries to reconnect to the server
	 * in increasing time steps.
	 * See {@link Options} for further information.
	 *
	 * @see {@link BasicEventBus.handleClose}
	 *
	 * @example
	 * ```ts
	 * const eb = BasicEventBus('https://localhost:9870/bridge', {
	 * 	autoReconnect: false
	 * });
	 *
	 * console.log(eb.autoReconnect); // false
	 * eb.autoReconnect = true;
	 * console.log(eb.autoReconnect); // true
	 * ```
	 */
	get autoReconnect(): boolean {
		return this.options.autoReconnect;
	}

	set autoReconnect(newState: boolean) {
		this.options.autoReconnect = newState;
		// clean up reconnect on `false`
		if (!newState && this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
		}
	}

	/**
	 * Returns the current state of the basic event bus.
	 * Currently, this can be connecting, open, closing and closed.
	 *
	 * @see {@link ConnectionState}
	 *
	 * @example
	 * ```ts
	 * const eb = new BasicEventBus('http://localhost:9870/bridge');
	 * // get current state from event bus
	 * console.log(eb.state);
	 * ```
	 */
	get state(): ConnectionState {
		switch (this.socket.readyState) {
			case SockJS.CONNECTING:
				return ConnectionState.CONNECTING;
			case SockJS.OPEN:
				return ConnectionState.OPEN;
			case SockJS.CLOSING:
				return ConnectionState.CLOSING;
			default:
				return ConnectionState.CLOSED;
		}
	}

	/**
	 * Stores encoded pending messages
	 * if the eventbus connection is currently closed.
	 * The basic event bus will try to send these messages
	 * when the connection to the server is reestablished.
	 *
	 * @see {@link BasicEventBus.send}
	 * @see {@link BasicEventBus.handleOpen}
	 *
	 * @example
	 * ```ts
	 * // some message
	 * const message = { type: 'rec', address: 'SOME_UUID' body: {} };
	 * const data = JSON.stringify(message);
	 *
	 * try {
	 * 	this.socket.send(data);
	 * } catch (err) {
	 * 	this.pending.push(data);
	 * }
	 * ```
	 */
	private pending: Array<string> = [];

	/**
	 * The web socket managed by the basic event bus instance.
	 * Messages are sent and received when this socket is open.
	 *
	 * @see {@link BasicEventBus.newSocket}
	 * @see {@link BasicEventBus.send}
	 * @see {@link BasicEventBus.handleMessage}
	 *
	 * @example
	 * ```ts
	 * // send a ping through the socket
	 * this.socket.send('{"type":"ping"}');
	 *
	 * // all methods and accessors of the web socket are available
	 * this.socket.onmessage = ev => {
	 * 	const message = JSON.parse(ev.data);
	 * 	console.log('Received message:', message);
	 * }
	 * ```
	 */
	private socket: SockJS;

	/**
	 * The ping timer generated by a `setInterval()`.
	 * If the socket is open, the current ping timer is stored here.
	 *
	 * @see {@link setInterval}
	 * @see {@link BasicEventBus.handleOpen}
	 * @see {@link BasicEventBus.handleClose}
	 *
	 * @example
	 * ```ts
	 * // get ping interval from options
	 * const { pingInterval } = this.options;
	 *
	 * this.pingTimerId = setInterval(() => {
	 * 	this.socket.send(rawPing);
	 * }, pingInterval);
	 * ```
	 */
	private pingTimer: any = null;

	/**
	 * The reconnect timer generated by `setTimeout()`.
	 *
	 * It stores the current reconnect timer if:
	 *
	 * - the web socket has closed unexpectedly **and**
	 * - automatic reconnect is enabled **and**
	 * - the reconnect attempts specified in the options are not reached
	 *
	 * @see {@link setTimeout}
	 * @see {@link BasicEventBus.handleClose}
	 * @see {@link BasicEventBus.autoReconnect}
	 * @see {@link BasicEventBus.reconnectAttempts}
	 * @see {@link BasicEventBus.newReconnectDelay}
	 *
	 * @example
	 * ```ts
	 * if (this.pingTimerId) clearInterval(this.pingTimerId);
	 * if (
	 * 	this.reconnectEnabled &&
	 * 	this.reconnectAttempts < this.options.reconnectAttempts
	 * ) {
	 * 	this.reconnectTimerId = setTimeout(() => {
	 * 		this.reconnectAttempts++;
	 * 		this.socket = this.newSocket();
	 * 		}, this.newReconnectDelay());
	 * }
	 * ```
	 */
	private reconnectTimer: any = null;

	/**
	 * An event handler that gets called when:
	 *
	 * - the event bus is opened
	 * - the event bus has reconnected after a connection loss
	 *
	 * @see {@link BasicEventBus.handleOpen}
	 *
	 * @example
	 * ```ts
	 * const eventBus = new BasicEventBus('http://localhost:9870/bridge');
	 *
	 * eventBus.onOpen = () => {
	 * 	console.log('Event bus has opened');
	 * };
	 *
	 * // on connection is open or successful reconnect
	 * // -> 'Event bus has opened'
	 * ```
	 */
	onOpen?(): void;

	/**
	 * An event listener that gets called when:
	 *
	 * - a new message arrives on the event bus
	 *
	 * @see {@link BasicEventBus.handleMessage}
	 *
	 * @example
	 * ```ts
	 * const eventBus = new BasicEventBus('http://localhost:9870/bridge');
	 *
	 * eventBus.onMessage = message => {
	 * 	console.log(message);
	 * };
	 * ```
	 */
	onMessage?(message: Message): void;

	/**
	 * An event handler that gets called:
	 *
	 * - when the event bus is closed
	 * - when the event bus has lost the connection
	 * - after an automatic reconnect failure
	 *
	 * @see {@link BasicEventBus.autoReconnect}
	 * @see {@link BasicEventBus.handleClose}
	 *
	 * @example
	 * ```ts
	 * const eventBus = new BasicEventBus('http://localhost:9870/bridge');
	 *
	 * eventBus.onClose = () => {
	 * 	console.log('Event bus has lost connection');
	 * };
	 *
	 * // on connection loss or reconnect failure
	 * // -> 'Event bus has lost connection'
	 * ```
	 */
	onClose?(): void;

	/**
	 * An event listener that gets called when:
	 *
	 * - the event bus has reconnected if automatic reconnect is enabled
	 *
	 * @see {@link BasicEventBus.autoReconnect}
	 * @see {@link BasicEventBus.handleOpen}
	 * @see {@link BasicEventBus.handleClose}
	 *
	 * @example
	 * ```ts
	 * const eventBus = new BasicEventBus('http://localhost:9870/bridge');
	 *
	 * eventBus.onReconnect = () => {
	 * 	console.log('Event bus has reconnected after a connection loss');
	 * };
	 *
	 * // on successful reconnect
	 * // -> 'Event bus has reconnected after a connection loss'
	 * ```
	 */
	onReconnect?(): void;

	/**
	 * Builds a new event bus
	 * that automatically tries to connect to the given server url.
	 *
	 * It uses the given options to configure the event bus instance
	 * and falls back on default options if some of the options are not set.
	 *
	 * @param url - the server url
	 * @param options - event bus configuration options
	 *
	 * @see {@link Options}
	 * @see {@link BasicEventBus.onOpen}
	 * @see {@link BasicEventBus.send}
	 *
	 * @example
	 * ```ts
	 * // build a new event bus instance
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
	 *
	 * // set an event listener when the the event bus is open
	 * eventBus.onOpen = () => {
	 * 	// publish a simple message to the event bus
	 * 	eventBus.send(registerMessage('some-channel'));
	 * };
	 * ```
	 */
	constructor(url: string, options: Partial<Options> = {}) {
		this.options = { ...defaultOptions, ...options };
		this.url = url;
		this.socket = this.newSocket();
	}

	/**
	 * Sends a message via the socket to the server.
	 * If the socket is currently not open and `store` is enabled,
	 * the given message are stored and will be sent on the next open connection.
	 *
	 * @param message - the message to send to the server
	 * @param store - when `true` the message is stored on a closed connection
	 * and will be sent on the next open connection
	 *
	 * @see {@link BasicEventBus.pending}
	 * @see {@link BasicEventBus.handleOpen}
	 *
	 * @example
	 * ```ts
	 * const eb = new BasicEventBus('https://localhost:9870/bridge');
	 * // send a sample message (that should be stored on closed connection)
	 * eb.send(publishMessage('some-channel', 'Boing!'));
	 *
	 * // send a register message (that should NOT be stored)
	 * eb.send(registerMessage('some-channel'), false);
	 * ```
	 */
	send(message: Message, store = true): void {
		this.options.logger?.debug('Send message to socket...');
		// encode message
		const data = JSON.stringify(message);

		// store when send don't work and enabled
		if (!this.sendRaw(data) && store) this.pending.push(data);
	}

	/**
	 * Close the event bus and stop receiving any further event bus messages.
	 * The connection will not be re-established automatically,
	 * even if automatic reconnect is enabled.
	 *
	 * @see {@link BasicEventBus.autoReconnect}
	 *
	 * @example
	 * ```ts
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
	 * // cleanup
	 * eventBus.close();
	 * ```
	 */
	close(): void {
		// stop auto reconnect feature
		this.autoReconnect = false;
		this.socket.close();
	}

	/**
	 * Create a new socket and register all event handlers to the new socket.
	 * It immediately tries to connect to the specified server.
	 * This is especially useful on the instance creation or on a reconnect try.
	 *
	 * @see {@link WebSocket}
	 * @see {@link (BasicEventBus:constructor)}
	 * @see {@link BasicEventBus.handleClose}
	 *
	 * @example
	 * ```ts
	 * // try to reconnect
	 * if (
	 * 	this.options.autoReconnect &&
	 * 	this.reconnectAttempts < this.options.reconnectAttempts
	 * ) {
	 * 	this.reconnectTimer = setTimeout(() => {
	 * 		this.reconnectAttempts++;
	 * 		// after timeout, create new socket which handles the next reconnect
	 * 		this.socket = this.newSocket();
	 * 	}, this.newReconnectDelay());
	 * }
	 * ```
	 */
	private newSocket(): SockJS {
		this.options.logger?.debug(`Open new socket to ${this.url}...`);
		const socket = new SockJS(this.url);

		socket.onopen = () => this.handleOpen();
		socket.onclose = () => this.handleClose();
		socket.onmessage = event => this.handleMessage(event);

		return socket;
	}

	/**
	 * Handles the "open" event from the current socket.
	 * It sets up the ping timer,
	 * calls the basic event bus {@link BasicEventBus.onOpen}
	 * and {@link BasicEventBus.onReconnect} event
	 * and send pending messages.
	 *
	 * @see {@link BasicEventBus.pingTimer}
	 * @see {@link BasicEventBus.onOpen}
	 * @see {@link BasicEventBus.pending}
	 *
	 * @example
	 * ```ts
	 * const socket = new SockJS(this.url);
	 * socket.onopen = () => this.handleOpen();
	 * ```
	 */
	private handleOpen(): void {
		this.options.logger?.success('Socket opened!');
		this.reconnectAttempts = 0;

		this.options.logger?.debug('Setup ping interval...');
		this.pingTimer = setInterval(
			() => this.sendRaw(rawPing),
			this.options.pingInterval
		);
		// inform upper layer
		this.onOpen?.();
		if (this.reconnectTimer) this.onReconnect?.();

		// send pending messages
		this.options.logger?.debug('Send pending messages...');
		this.pending = this.pending.filter(data => !this.sendRaw(data));
	}

	/**
	 * Handles the "close" event from the current socket.
	 * It stops the ping timer,
	 * calls the basic event bus {@link BasicEventBus.onClose} event
	 * and sets up a reconnect timeout when enabled.
	 *
	 * @see {@link BasicEventBus.pingTimer}
	 * @see {@link BasicEventBus.onClose}
	 * @see {@link BasicEventBus.autoReconnect}
	 *
	 * @example
	 * ```ts
	 * const socket = new SockJS(this.url);
	 * socket.onclose = () => this.handleClose();
	 * ```
	 */
	private handleClose(): void {
		this.options.logger?.warn('Socket closed!');

		this.options.logger?.debug('Clear ping interval...');
		clearInterval(this.pingTimer);
		// inform upper layer
		this.onClose?.();

		// handle reconnect
		if (
			this.options.autoReconnect &&
			this.reconnectAttempts < this.options.reconnectAttempts
		) {
			const reconnectDelay = this.newReconnectDelay();
			this.options.logger?.debug(
				`Setup automatic reconnect in ${reconnectDelay}ms...`
			);
			this.reconnectTimer = setTimeout(() => {
				this.reconnectAttempts++;
				this.options.logger?.debug(
					`Try reconnect No. ${this.reconnectAttempts}...`
				);
				// after timeout, create new socket which handles the next reconnect
				this.socket = this.newSocket();
			}, reconnectDelay);
		}
	}

	/**
	 * Handles the "message" event from the current socket.
	 * It tries to decode and validate the message
	 * and sends the decoded message on the {@link BasicEventBus.onMessage} event.
	 *
	 * @param event - the raw socket event
	 *
	 * @see {@link BasicEventBus.onMessage}
	 *
	 * @example
	 * ```ts
	 * const socket = new SockJS(this.url);
	 * socket.onmessage = event => this.handleMessage(event);
	 * ```
	 */
	private handleMessage(event: MessageEvent): void {
		this.receivedMessages++;
		this.options.logger?.debug(`Message No. ${this.receivedMessages} received`);
		try {
			// decode message
			const message: Message = JSON.parse(event.data);
			if (validate(message)) {
				this.options.logger?.debug('Message is valid. Return to handler...');
				this.onMessage?.(message);
			} else {
				this.options.logger?.error('Message is invalid but JSON parsable');
				this.onMessage?.(
					errorMessage(
						2,
						'SyntaxError',
						`Invalid message received: ${event.data}`
					)
				);
			}
		} catch (err) {
			this.options.logger?.error('Message is not JSON parsable');
			this.onMessage?.(
				errorMessage(1, 'SyntaxError', `Cannot decode message: '${event.data}'`)
			);
		}
	}

	/**
	 * Sends a raw message via the socket to the server.
	 *
	 * **Notice**:
	 * Please use this function instead of calling `this.socket.send` directly,
	 * because this function enables additional monitoring.
	 *
	 * @param data - the data to send to the server
	 * @returns `true` if the message was successfully sent
	 * and `false` if the message was not send
	 *
	 * @see {@link BasicEventBus.send}
	 * @see {@link BasicEventBus.handleOpen}
	 *
	 * @example
	 * ```ts
	 * if (!this.sendRaw(data)) this.pending.push(data);
	 * ```
	 */
	private sendRaw(data: string): boolean {
		try {
			this.socket.send(data);
			this.sentMessages++;
			this.options.logger?.debug(`Sent message No. ${this.sentMessages}`);
			return true;
		} catch (err) {
			this.options.logger?.debug('Socket not open. Cannot send message');
			return false;
		}
	}

	/**
	 * Calculate a new reconnect delay
	 * after the basic event bus tries to reconnect to the server
	 * if automatic reconnect is enabled.
	 *
	 * @returns a new reconnect delay in milliseconds
	 * which is in the range of minimum delay
	 * and maximum delay and increases
	 * with increasing reconnect attempts based on a power function.
	 *
	 * @see {@link Options}
	 * @see {@link BasicEventBus.reconnectAttempts}
	 * @see {@link BasicEventBus.handleClose}
	 *
	 * @example
	 * ```ts
	 * // handle reconnect
	 * if (
	 * 	this.options.autoReconnect &&
	 * 	this.reconnectAttempts < this.options.reconnectAttempts
	 * ) {
	 * 	this.reconnectTimer = setTimeout(() => {
	 * 		this.reconnectAttempts++;
	 * 		// after timeout, create new socket which handles the next reconnect
	 * 		this.socket = this.newSocket();
	 * 	}, this.newReconnectDelay());
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
			this.reconnectAttempts ** this.options.reconnectExponent;
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
