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
import {
	ChannelAddress,
	ErrorMessage,
	JsonSerializable,
	Options,
	Headers,
	Callback,
	Message
} from '@wuespace/telestion-client-types';

import { ConnectionState } from './model';
import {
	generateUUID,
	publishMessage,
	registerMessage,
	sendMessage,
	unregisterMessage
} from './lib';
import { BasicEventBus } from './basic-event-bus';

/**
 * An eventbus connector for the Vert.x environment.
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
	 * The basic event bus instance, the event bus communicates to.
	 *
	 * @see {@link (EventBus:constructor) | EventBus Constructor}
	 *
	 * @example
	 * ```ts
	 * this.bus = new BasicEventBus(url, options);
	 * this.bus.onOpen = () => {
	 * 	// register all current event handlers
	 * 	this.handlers
	 * 		.map(handler => handler[0])
	 * 		.filter((channel, _, channels) => !channels.includes(channel))
	 * 		.forEach(channel => this.bus.send(registerMessage(channel), false));
	 * 	this.onOpen?.();
	 * };
	 * this.bus.onClose = () => this.onOpen?.();
	 * this.bus.onReconnect = () => this.onReconnect?.();
	 * this.bus.onMessage = message => this.handleMessage(message);
	 * ```
	 */
	private readonly bus: BasicEventBus;

	/**
	 * An array that stores all registered event handlers
	 * registered via the
	 * {@link EventBus.register} and {@link EventBus.send} method.
	 *
	 * An array elements contains:
	 * - the channel address the callback is registered too,
	 * - the callback itself
	 * - a persistent flag which indicates, if the handler is temporary
	 *   and can be removed after the first call
	 *
	 * @see {@link EventBus.register}
	 * @see {@link EventBus.unregister}
	 * @see {@link EventBus.send}
	 * @see {@link EventBus.handleMessage}
	 *
	 * @example
	 * ```ts
	 * if (message.type === 'rec') {
	 * 	// call registered handlers
	 * 	this.handlers
	 * 		.filter(handler => handler[0] === message.address)
	 * 		.forEach(handler => handler[1](message.body));
	 *
	 * 	// remove temporary reply handlers (inserted via `send`)
	 * 	this.handlers = this.handlers.filter(
	 * 		handler => handler[2] && handler[0] === message.address
	 * 	);
	 * }
	 * ```
	 */
	private handlers: Array<
		readonly [channel: ChannelAddress, callback: Callback, persistent: boolean]
	> = [];

	/**
	 * The options as readonly member for the current event bus instance.
	 *
	 * A merge of the default options and the in the constructor given options
	 * for the event bus instance.
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
	get options(): Options {
		return this.bus.options;
	}

	/**
	 * The server url the event bus is connected to.
	 *
	 * @see {@link (EventBus:constructor) | EventBus Constructor}
	 *
	 * @example
	 * ```ts
	 * const eb = new EventBus('http://localhost:9870/bridge');
	 *
	 * console.log(eb.url); // 'http://localhost:9870/bridge'
	 * ```
	 */
	get url(): string {
		return this.bus.url;
	}

	/**
	 * Returns the current state of the event bus.
	 * Currently, this can be connecting, open, closing and closed.
	 *
	 * @see {@link ConnectionState}
	 *
	 * @example
	 * ```ts
	 * const eb = new EventBus('http://localhost:9870/bridge');
	 * // get current state from event bus
	 * console.log(eb.state);
	 * ```
	 */
	get state(): ConnectionState {
		return this.bus.state;
	}

	/**
	 * Returns the number of reconnection attempts
	 * if the socket has unexpectedly closed
	 * and automatic reconnection is enabled. Otherwise, it returns `0`.
	 *
	 * Resets to `0` if the connection is re-established.
	 *
	 * @see {@link EventBus.autoReconnect}
	 * @see {@link EventBus.setAutoReconnect}
	 *
	 * @example
	 * ```ts
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
	 *
	 * // later, the event bus closes unexpectedly and cannot reconnect
	 * console.log(eventBus.reconnectionAttempts);
	 * // -> number > 0
	 * ```
	 */
	get reconnectAttempts(): number {
		return this.bus.reconnectAttempts;
	}

	/**
	 * The current number of sent messages to the server..
	 *
	 * @see {@link EventBus.send}
	 * @see {@link EventBus.publish}
	 *
	 * @example
	 * ```ts
	 * const eb = new EventBus('http://localhost:9870/bridge');
	 *
	 * eb.onOpen = () => {
	 * 	console.log(eb.sentMessages); // 0
	 * 	eb.publish('awesome-channel', 'Hello World!');
	 * 	console.log(eb.sentMessages); // 1
	 * };
	 * ```
	 */
	get sentMessages(): number {
		return this.bus.sentMessages;
	}

	/**
	 * The current number of received messages from the server.
	 *
	 * @see {@link EventBus.handleMessage}
	 * @see {@link EventBus.register}
	 *
	 * @example
	 * ```ts
	 * const eb = new EventBus('http://localhost:9870/bridge');
	 *
	 * eb.onOpen = () => {
	 * 	console.log(eb.receivedMessages); // 0
	 * };
	 *
	 * // later on a received message
	 * eb.onMessage = message => {
	 * 	console.log(eb.receivedMessages); // 1
	 * };
	 * ```
	 */
	get receivedMessages(): number {
		return this.bus.receivedMessages;
	}

	/**
	 * Returns `true` if automatic reconnect is enabled.
	 * Otherwise, it returns `false`.
	 *
	 * @see {@link EventBus.setAutoReconnect}
	 *
	 * @example
	 * ```ts
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
	 *
	 * eventBus.onOpen = () => {
	 * 	console.log(eventBus.autoReconnect);
	 * 	// -> 'true'
	 * 	eventBus.setAutoReconnect(false);
	 * 	console.log(eventBus.autoReconnect);
	 * 	// -> 'false'
	 * }
	 * ```
	 */
	get autoReconnect(): boolean {
		return this.bus.autoReconnect;
	}

	/**
	 * An event listener that gets called when:
	 *
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
	onOpen?(): void;

	/**
	 * An event listener that gets called:
	 *
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
	onClose?(): void;

	/**
	 * An event listener that gets called when:
	 *
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
	onReconnect?(): void;

	/**
	 * An event listener that gets called when:
	 *
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
	onError?(message: ErrorMessage): void;

	/**
	 * An event listener that gets called when:
	 *
	 * - a new message is received from the server via the socket
	 *
	 * When returned with `true` the event bus stops
	 * further processing this message.
	 *
	 * @example
	 * ```ts
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
	 *
	 * eventBus.onMessage = message => {
	 * 	if (message.type === 'rec' && message.body === 'skip') {
	 * 	  return true;
	 * 	}
	 * };
	 *
	 * // This specific message will be skipped
	 * // and do not reach any registered handlers!
	 * ```
	 */
	onMessage?(message: Message): boolean | void;

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
		this.bus = new BasicEventBus(url, options);
		this.bus.onOpen = () => {
			// register all current event handlers
			this.handlers
				.map(handler => handler[0])
				.filter((channel, _, channels) => !channels.includes(channel))
				.forEach(channel => this.bus.send(registerMessage(channel), false));
			this.onOpen?.();
		};
		this.bus.onClose = () => this.onOpen?.();
		this.bus.onReconnect = () => this.onReconnect?.();
		this.bus.onMessage = message => this.handleMessage(message);
	}

	/**
	 * Enable or disable automatic reconnect on unexpected connection loss.
	 *
	 * If automatic reconnect is enabled,
	 * the event bus tries to reconnect to the backend server
	 * in increasing time steps until a connection is re-established.
	 *
	 * Initially enabled.
	 *
	 * @param newState - `true` to enable automatic reconnect, `false` to disable
	 *
	 * @see {@link EventBus.autoReconnect}
	 * @see {@link EventBus.onReconnect}
	 *
	 * @example
	 * ```ts
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
	 *
	 * eventBus.onReconnect = () => {
	 * 	console.log('Event bus has reconnected');
	 * };
	 *
	 * // disable automatic reconnect
	 * eventBus.setAutoReconnect(false);
	 * ```
	 */
	setAutoReconnect(newState: boolean): void {
		this.bus.autoReconnect = newState;
	}

	/**
	 * Publishes a message to the specified address.
	 *
	 * If the eventbus is currently closed, it stores the message
	 * and publishes it after the connection is open.
	 *
	 * @param address - address to which the content gets published
	 * @param content - the content that will be broadcasted
	 * to the specified address
	 * @param headers - optional headers sent with the event bus message
	 *
	 * @see {@link EventBus.onOpen}
	 *
	 * @example
	 * ```ts
	 * // some vertx eventbus address to publish to
	 * const address = 'MY_CHANNEL';
	 *
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
	 *
	 * eventBus.onOpen = () => {
	 * 	eventBus.publish(address, 'Hey there!');
	 * }
	 * ```
	 */
	publish(
		address: ChannelAddress,
		content: JsonSerializable,
		headers?: Headers
	): void {
		this.bus.send(publishMessage(address, content, headers));
	}

	/**
	 * Publishes a message to the specified address.
	 * It also registers a one-time event handler
	 * that gets called when the first answer to the message is received.
	 *
	 * @param address - address the content is sent to
	 * @param content - the content that will sent to the specified address
	 * @param callback - the function that gets called
	 * when the first answer is received
	 * @param headers - optional headers sent with the event bus message
	 *
	 * @see {@link EventBus.onOpen}
	 * @see {@link EventBus.handlers}
	 *
	 * @example
	 * ```ts
	 * // some vertx eventbus address to send to
	 * const address = 'MY_CHANNEL';
	 *
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
	 *
	 * eventBus.onOpen = () => {
	 * 	eventBus.send(address, 'Ping', message => {
	 * 		console.log('Pong:', message);
	 * 	});
	 * };
	 * ```
	 */
	// Internally it generates a UUID as reply address
	// that is sent with the message.
	// The specified callback is registered in the reply handlers
	// using the generated UUID.
	send(
		address: ChannelAddress,
		content: JsonSerializable,
		callback: Callback,
		headers?: Headers
	): void {
		const replyAddress = generateUUID();
		this.handlers.push([replyAddress, callback, false]);
		this.bus.send(sendMessage(address, replyAddress, content, headers));
	}

	/**
	 * Registers an event handler to the specified address.
	 *
	 * The given callback is executed when the event bus receives a message
	 * on the specified address.
	 *
	 * @param address - the address on which the event handler
	 * that executes the callback on incoming messages gets registered
	 * @param callback - the function that gets executed
	 * when incoming messages are received on the specified address
	 * @param headers - optional headers sent with the initial registration
	 * message to the backend on the first register event
	 *
	 * @see {@link EventBus.unregister}
	 * @see {@link EventBus.onOpen}
	 *
	 * @example
	 * ```ts
	 * // some vertx eventbus address to register to
	 * const address = 'MY_CHANNEL';
	 *
	 * // define a handler
	 * const handler: Callback = message => {
	 * 	console.log(message);
	 * };
	 *
	 * const eventBus = new EventBus('https://localhost:9870/bridge');
	 *
	 * eventBus.onOpen = () => {
	 * 	eventBus.register(address, handler);
	 * };
	 *
	 * // later
	 * // unregister handler
	 * eventBus.unregister(address, handler);
	 * ```
	 */
	// The specified headers are sent with the registration message
	// that goes to the backend on the first registered event call
	// for this specified address.
	//
	// If the eventbus is currently closed it stores the callback
	// and registers it after the connection is open.
	register(
		address: ChannelAddress,
		callback: Callback,
		headers?: Headers
	): void {
		// send register if no other listens for this address yet
		// -> tell server to forward all traffic on this address
		if (this.handlers.every(handler => handler[0] !== address)) {
			this.bus.send(registerMessage(address, headers));
		}

		// register
		this.handlers.push([address, callback, true]);
	}

	/**
	 * Unregisters an event handler from the specified address.
	 *
	 * The callback argument must be the same as the one that was registered
	 * using `registerHandler()`.
	 *
	 * The specified headers are sent with the unregister message
	 * that goes to the backend
	 * **if** no other event handlers are registered to this address anymore.
	 *
	 * @param address - the address the event handler unregisters from
	 * @param callback - the callback to unregister from the address
	 * @param headers - optional headers sent with the last unregister message
	 *
	 * @see {@link EventBus.register}
	 *
	 * @example
	 * ```ts
	 * // some vertx eventbus address to register to
	 * const address = 'MY_CHANNEL';
	 *
	 * // define a handler
	 * const handler: Callback = message => {
	 * 	console.log(message);
	 * };
	 *
	 * const eventBus = new EventBus('https://localhost:9870/bridge');
	 *
	 * eventBus.onOpen = () => {
	 * 	eventBus.register(address, handler);
	 * };
	 *
	 * // later
	 * // unregister handler
	 * eventBus.unregister(address, handler);
	 * ```
	 */
	unregister(
		address: ChannelAddress,
		callback: Callback,
		headers: Headers = {}
	): void {
		// unregister
		this.handlers = this.handlers.filter(
			handler => !(handler[0] === address && handler[1] === callback)
		);

		// send unregister if no other listens for this address
		// -> save socket bandwidth
		if (this.handlers.every(handler => handler[0] !== address)) {
			this.bus.send(unregisterMessage(address, headers));
		}
	}

	/**
	 * Close the event bus and stop receiving any further event bus messages.
	 * The connection will not be re-established automatically,
	 * even if automatic reconnect is enabled.
	 *
	 * @see {@link EventBus.autoReconnect}
	 * @see {@link EventBus.setAutoReconnect}
	 *
	 * @example
	 * ```ts
	 * const eventBus = new EventBus('http://localhost:9870/bridge');
	 * // cleanup
	 * eventBus.close();
	 * ```
	 */
	close(): void {
		this.bus.close();
	}

	/**
	 * Handles incoming messages from the basic event bus.
	 * It sorts the messages, call the event handlers (if defined),
	 * and deletes temporary event handlers from the `send` function.
	 *
	 * @param message - the received message from the basic event bus
	 *
	 * @see {@link (EventBus:constructor) | EventBus Constructor}
	 *
	 * @example
	 * ```ts
	 * this.bus = new BasicEventBus(url, options);
	 * this.bus.onMessage = message => this.handleMessage(message);
	 * ```
	 */
	private handleMessage(message: Message): void {
		// first, call upper layer and skip further processing, when desired
		if (this.onMessage?.(message)) return;

		if (message.type === 'err') this.onError?.(message);
		else if (message.type === 'rec') {
			// call registered handlers
			this.handlers
				.filter(handler => handler[0] === message.address)
				.forEach(handler => handler[1](message.body));

			// remove temporary reply handlers (inserted via `send`)
			this.handlers = this.handlers.filter(
				handler => handler[2] && handler[0] === message.address
			);
		}
	}
}
