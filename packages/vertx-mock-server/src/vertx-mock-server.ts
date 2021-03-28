/* eslint-disable max-lines */
import http from 'http';
import sockjs, { Connection } from 'sockjs';
import {
	ChannelAddress,
	JsonSerializable,
	Message,
	PublishMessage,
	SendMessage
} from '@wuespace/telestion-client-types';

import {
	ErrorContent,
	ListenOptions,
	CallbackId,
	Callback,
	CallbackArgs
} from './model';
import {
	getLogger,
	decodeMessage,
	encodeErrorMessage,
	encodeReceiveMessage
} from './lib';

const logger = getLogger('Vert.x Mock Server');

/**
 * A mock server for a Vert.x WebSocket Event Bus bridge
 * to JavaScript clients like {@link @wuespace/vertx-event-bus#EventBus}.
 */
export class MockServer {
	/**
	 * Holds all active connections with the Vert.x mock server.
	 */
	private connections: Connection[];

	/**
	 * Holds all registered callbacks.
	 */
	private readonly callbacks: Array<
		readonly [channel: ChannelAddress, callback: Callback]
	>;

	/**
	 * The eventbus instance which defines the setup procedure
	 * for a new connection from a client.
	 */
	private readonly eventBus: sockjs.Server;

	/**
	 * The generated http server where sockjs attaches to.
	 */
	private readonly httpServer: http.Server;

	onInit?(): void;

	onConnection?(connection: Connection): void;

	onMessage?(message: Message): boolean | void;

	onClosedConnection?(connection: Connection): void;

	onClose?(): void;

	/**
	 * Builds a new Vert.x mock server.
	 * @param prefix - the prefix on which the event bus will be available
	 *
	 * @see {@link MockServer.listen}
	 * @see {@link MockServer.close}
	 *
	 * @example
	 * ```ts
	 * class MyMockServer extends MockServer {
	 * 	constructor() {
	 * 		super('custom-prefix');
	 * 	}
	 * }
	 *
	 * const server = new MyMockServer();
	 * server.listen();
	 * ```
	 */
	constructor(prefix = '/bridge') {
		this.connections = [];
		this.callbacks = [];

		this.eventBus = sockjs.createServer();
		this.httpServer = http.createServer();
		this.setupEventBus(prefix);
	}

	/**
	 * Starts the Vert.x mock server and listening for incoming connections.
	 * @param port - the port on which the server listens
	 * @param hostname - the hostname on which the server listens
	 *
	 * @see {@link MockServer.close}
	 *
	 * @example
	 * ```ts
	 * const server = new MockServer();
	 * server.listen(12345, 'localhost'); // listen on port 12345 on 'localhost'
	 * ```
	 */
	listen({ port = 9870, hostname = '0.0.0.0' }: ListenOptions): void {
		this.httpServer.listen(port, hostname);
		this.onInit?.();
	}

	/**
	 * Stops the server from accepting new connections
	 * and close currently active connections.
	 *
	 * @returns a promise which resolves when the server is closed
	 *
	 * @see {@link MockServer.listen}
	 *
	 * @example
	 * ```ts
	 * const server = new MockServer();
	 * server.listen();
	 * // some code later
	 * server.close().then(() => console.log('Closed'));
	 * ```
	 */
	close(): Promise<void> {
		this.onClose?.();
		return new Promise<void>((resolve, reject) =>
			this.httpServer.close(err => (err ? reject(err) : resolve()))
		);
	}

	/**
	 * Sends a message to the specified channel.
	 * @param channel - the channel the message are sent to
	 * @param message - the message that are sent over the specified channel
	 *
	 * @see {@link OnInit}
	 * @see {@link OnClose}
	 * @see {@link MockServer.sendError}
	 *
	 * @example
	 * ```ts
	 * const CHANNEL = 'my-channel';
	 *
	 * class MyMockServer extends MockServer implements OnInit, OnClose {
	 * 	private iteration: number = 0;
	 * 	private intervalId: any = undefined;
	 *
	 * 	onInit() {
	 * 		// send and increment
	 * 		this.intervalId = setInterval(() => {
	 * 			this.send(CHANNEL, this.iteration);
	 * 		  this.iteration = this.iteration + 1;
	 * 		}, 1000);
	 * 	}
	 *
	 * 	onClose() {
	 * 		if (this.intervalId) {
	 * 			clearInterval(this.intervalId);
	 * 			this.intervalId = undefined;
	 * 		}
	 * 	}
	 * }
	 *
	 * const server = new MyMockServer();
	 * server.listen();
	 * ```
	 */
	protected send(channel: ChannelAddress, message: JsonSerializable): void {
		this.pushMessage(encodeReceiveMessage(channel, message));
	}

	/**
	 * Sends an error message to the specified channel.
	 * @param channel - the channel the message are sent to
	 * @param error - the message that are sent over the specified channel
	 *
	 * @see {@link ErrorContent}
	 * @see {@link MockServer.send}
	 * @see {@link MockServer.register}
	 * @see {@link MockServer.unregister}
	 *
	 * @example
	 * ```ts
	 * const CHANNEL = 'my-channel';
	 *
	 * class MyMockServer extends MockServer implements OnInit, OnClose {
	 * 	private id: CallbackId = 0;
	 *
	 * 	onInit() {
	 * 		this.id = this.register(CHANNEL, () => {
	 * 			this.sendError(CHANNEL, {
	 * 				failureCode: 1,
	 * 				failureType: 'Message received',
	 * 				message: 'Message was received'
	 * 			});
	 * 		});
	 * 	}
	 *
	 * 	onClose() {
	 * 		this.unregister(this.id);
	 * 	}
	 * }
	 *
	 * const server = new MyMockServer();
	 * server.listen();
	 * ```
	 */
	protected sendError(channel: ChannelAddress, error: ErrorContent): void {
		this.pushMessage(encodeErrorMessage(channel, error));
	}

	/**
	 * Registers a callback to a specified channel.
	 * The callback gets called when a new message arrives on this channel.
	 *
	 * @param channel - the channel the callback is registered to
	 * @param callback - the callback to register
	 *
	 * @see {@link Callback}
	 * @see {@link CallbackId}
	 * @see {@link MockServer.unregister}
	 *
	 * @example
	 * ```ts
	 * const CHANNEL = 'my-channel';
	 *
	 * class MyMockServer extends MockServer implements OnInit, OnClose {
	 * 	private id: CallbackId = 0;
	 *
	 * 	onInit() {
	 * 		this.id = this.register(CHANNEL, () => {
	 * 			this.send(CHANNEL, 'pong');
	 * 		});
	 * 	}
	 *
	 * 	onClose() {
	 * 		this.unregister(this.id);
	 * 	}
	 * }
	 *
	 * const server = new MyMockServer();
	 * server.listen();
	 * ```
	 */
	protected register(channel: ChannelAddress, callback: Callback): CallbackId {
		return this.callbacks.push([channel, callback]);
	}

	/**
	 * Unregisters/Removes a callback from a channel
	 * with the given callback id from the {@link MockServer.register} function.
	 *
	 * @param id - the callback id from the {@link MockServer.register} function
	 *
	 * @see {@link CallbackId}
	 * @see {@link MockServer.register}
	 *
	 * @example
	 * ```ts
	 * const CHANNEL = 'my-channel';
	 *
	 * class MyMockServer extends MockServer implements OnInit, OnClose {
	 * 	private id: CallbackId = 0;
	 *
	 * 	onInit() {
	 * 		this.id = this.register(CHANNEL, () => {
	 * 			this.send(CHANNEL, 'pong');
	 * 		});
	 * 	}
	 *
	 * 	onClose() {
	 * 		this.unregister(this.id);
	 * 	}
	 * }
	 *
	 * const server = new MyMockServer();
	 * server.listen();
	 * ```
	 */
	protected unregister(id: CallbackId): void {
		delete this.callbacks[id];
	}

	/**
	 * Get all currently active SockJS connections to the Vert.x mock server.
	 * @returns all current SockJS connections
	 *
	 * @example
	 * ```ts
	 * const CHANNEL = 'my-channel';
	 *
	 * class MyMockServer extends MockServer implements OnInit, OnClose {
	 * 	private id: CallbackId = 0;
	 *
	 * 	onInit() {
	 * 		this.id = this.register(CHANNEL, args => {
	 * 			if (args.type === 'send') args.respond(this.getConnections().length);
	 * 		});
	 * 	}
	 *
	 * 	onClose() {
	 * 		this.unregister(this.id);
	 * 	}
	 * }
	 *
	 * const server = new MyMockServer();
	 * server.listen();
	 * ```
	 */
	protected getConnections(): Array<Connection> {
		return [...this.connections];
	}

	/**
	 * Pushes a raw/encoded message onto a active connections.
	 * @param data - the raw/encoded message to push to all active connections
	 *
	 * @see {@link MockServer.send}
	 * @see {@link MockServer.sendError}
	 *
	 * @example
	 * ```ts
	 * protected send(channel: ChannelAddress, message: JsonSerializable): void {
	 * 	this.pushMessage(encodeReceiveMessage(channel, message));
	 * }
	 * ```
	 */
	private pushMessage(data: string): void {
		this.connections.forEach(conn => conn.write(data));
	}

	/**
	 * Set up the internal event bus, register all necessary event calls
	 * for incoming connections and attaches to the internal http server instance.
	 *
	 * @param prefix - the prefix under which the event bus is reachable
	 *
	 * @example
	 * ```ts
	 * constructor(prefix = '/bridge') {
	 * 	this.connections = [];
	 * 	this.callbacks = [];
	 *
	 * 	this.eventBus = sockjs.createServer();
	 * 	this.httpServer = http.createServer();
	 * 	this.setupEventBus(prefix);
	 * }
	 * ```
	 */
	private setupEventBus(prefix: string): void {
		// define handlers
		this.eventBus.on('connection', conn => {
			this.connections = [...this.connections, conn];
			// handle incoming messages
			conn.on('data', data => this.handleData(conn, data));
			conn.on('close', () => this.handleClose(conn));

			// inform upper layer
			this.onConnection?.(conn);
		});

		// install handlers on http server
		this.eventBus.installHandlers(this.httpServer, { prefix });
	}

	/**
	 * Handles the incoming data, decodes them sorts them
	 * and calls the registered callbacks.
	 *
	 * @param conn - the connection the message came from
	 * @param data - the raw/encoded message
	 *
	 * @see {@link MockServer.setupEventBus}
	 *
	 * @example
	 * ```ts
	 * // define handlers
	 * this.eventBus.on('connection', conn => {
	 * 	this.connections = [...this.connections, conn];
	 * 	// handle incoming messages
	 * 	conn.on('data', data => this.handleData(conn, data));
	 * 	conn.on('close', () => this.handleClose(conn));
	 *
	 * 	// inform upper layer
	 * 	this.onConnection?.(conn);
	 * });
	 * ```
	 */
	private handleData(conn: Connection, data: string): void {
		const message = decodeMessage(data);
		if (this.onMessage?.(message)) return;

		// filter for send and publish messages
		if (message.type === 'send' || message.type === 'publish') {
			this.processMessage(conn, message);
		} else if (message.type === 'rec') {
			// 'rec' messages are only valid from backend to frontend
			logger.warn(
				"Received 'rec' message from client. Something nasty is going on here...",
				message
			);
		}
	}

	/**
	 * Handles the closed event on the current connection.
	 * It removes the given connection from the connection list
	 * and call the connection closed hook.
	 *
	 * @param conn - the connection that has closed
	 *
	 * @see {@link MockServer.setupEventBus}
	 *
	 * @example
	 * ```ts
	 * // define handlers
	 * this.eventBus.on('connection', conn => {
	 * 	this.connections = [...this.connections, conn];
	 * 	// handle incoming messages
	 * 	conn.on('data', data => this.handleData(conn, data));
	 * 	conn.on('close', () => this.handleClose(conn));
	 *
	 * 	// inform upper layer
	 * 	this.onConnection?.(conn);
	 * });
	 * ```
	 */
	private handleClose(conn: Connection): void {
		this.connections = this.connections.filter(current => current !== conn);
		this.onClosedConnection?.(conn);
	}

	/**
	 * Processes the received message, determines the type,
	 * builds the arguments for the callbacks
	 * and call all registered callbacks on the message channel.
	 *
	 * @param conn - the connection the message came from
	 * @param message - the decoded message
	 *
	 * @see {@link MockServer.handleData}
	 *
	 * @example
	 * ```ts
	 * const message = decodeMessage(data);
	 *
	 * if (message.type === 'send' || message.type === 'publish') {
	 * 	this.processMessage(conn, message);
	 * }
	 * ```
	 */
	private processMessage(
		conn: Connection,
		message: SendMessage | PublishMessage
	): void {
		const args: CallbackArgs = {
			message: message.body,
			type: message.type,
			respond: MockServer.buildRespondHandler(conn, message)
		};

		this.callbacks.forEach(([channel, callback]) => {
			if (channel === message.address) {
				callback(args);
			}
		});
	}

	/**
	 * Builds the respond handler for a 'send' message.
	 * @param conn - the connection the message came from
	 * @param message - the 'send' message to build the respond handler for
	 *
	 * @see {@link MockServer.processMessage}
	 *
	 * @example
	 * ```ts
	 * const args: CallbackArgs = {
	 * 	message: message.body,
	 * 	type: message.type,
	 * 	respond: MockServer.buildRespondHandler(conn, message)
	 * };
	 *
	 * callback(args);
	 * ```
	 */
	private static buildRespondHandler(
		conn: Connection,
		message: SendMessage | PublishMessage
	): (response: JsonSerializable) => void {
		return response => {
			if (message.replyAddress) {
				const responseData = encodeReceiveMessage(
					message.replyAddress,
					response
				);
				conn.write(responseData);
			} else {
				logger.warn(
					`Reply address for 'send' message on channel ${message.address} is not available...`,
					message
				);
			}
		};
	}
}
