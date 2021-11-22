/* eslint-disable max-lines */
import http from 'http';
import sockjs, { Connection } from 'sockjs';
import {
	ChannelAddress,
	ErrorMessage,
	JsonSerializable,
	Message,
	PublishMessage,
	ReceiveMessage,
	SendMessage
} from '@wuespace/telestion-client-types';
import { ComponentLogger } from '@fliegwerk/logsemts';

import {
	ErrorContent,
	ListenOptions,
	CallbackId,
	Callback,
	CallbackArgs,
	VertxMockServerOptions
} from './model';

const defaultOptions = {
	port: 9870,
	hostname: '0.0.0.0'
};

/**
 * A mock server for a Vert.x WebSocket Event Bus bridge
 * to JavaScript clients like {@link @wuespace/vertx-event-bus#EventBus}.
 */
export class MockServer {
	private readonly logger?: ComponentLogger;

	/**
	 * Holds all active connections of the Vert.x mock server.
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
	 * @param options - options to further configure the mock server
	 *
	 * @see {@link MockServer.listen}
	 * @see {@link MockServer.close}
	 *
	 * @example
	 * ```ts
	 * const logger = new Logger({
	 * 	loggers: [ChalkLogger(chalk)]
	 * });
	 *
	 * const moduleLogger = logger.getComponentLogger('MockServer');
	 *
	 * const server = new MockServer({ logger: moduleLogger });
	 * server.listen();
	 * ```
	 */
	constructor(options?: Partial<VertxMockServerOptions>) {
		this.logger = options?.logger;
		this.connections = [];
		this.callbacks = [];

		this.logger?.debug(`Creating sockjs instance`);
		this.eventBus = sockjs.createServer({
			// see https://www.npmjs.com/package/sockjs#sockjs-node-api
			log: (severity: 'debug' | 'info' | 'error', message: string) => {
				if (severity === 'debug') this.logger?.debug(message);
				else if (severity === 'info') this.logger?.info(message);
				else this.logger?.error(message);
			}
		});
		this.logger?.debug('Creating http server instance');
		this.httpServer = http.createServer();
		this.setupEventBus(options?.prefix);
	}

	/**
	 * Starts the Vert.x mock server, listening for incoming connections.
	 * @param options - options to configure the Vert.x mock server
	 * in the listen process
	 *
	 * @see {@link MockServer.close}
	 *
	 * @example
	 * ```ts
	 * const server = new MockServer();
	 * server.listen({
	 * 	port: 12345,
	 * 	hostname: 'localhost'
	 * }); // listen on port 12345 on 'localhost'
	 * ```
	 */
	listen(options?: Partial<ListenOptions>): void {
		const final: ListenOptions = { ...defaultOptions, ...options };
		this.logger?.debug(`Server listening on ${final.hostname}:${final.port}`);
		this.httpServer.listen(final.port, final.hostname);
		this.onInit?.();
	}

	/**
	 * Stops the server from accepting new connections
	 * and closes currently active connections.
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
		this.logger?.debug('Closing server...');
		this.onClose?.();

		// request all connections to close
		this.connections.forEach(conn => conn.end());
		return new Promise<void>((resolve, reject) => {
			this.httpServer.close(err => (err ? reject(err) : resolve()));
		}).then(() => this.logger?.info('Server closed'));
	}

	/**
	 * Sends a message to the specified channel.
	 * @param channel - the channel the message gets sent to
	 * @param content - the message content that gets sent over the specified channel
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
	protected send(channel: ChannelAddress, content: JsonSerializable): void {
		const message: ReceiveMessage = {
			type: 'rec',
			address: channel,
			body: content,
			headers: {}
		};
		this.pushMessage(message);
	}

	/**
	 * Sends an error message to the specified channel.
	 * @param error - the message that gets sent over the specified channel
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
	 * 			this.sendError({
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
	protected sendError(error: ErrorContent): void {
		const message: ErrorMessage = {
			type: 'err',
			...error
		};
		this.pushMessage(message);
	}

	/**
	 * Registers a callback to a specified channel.
	 * The callback gets called when a new message arrives on this channel.
	 *
	 * @param channel - the channel the callback gets registered to
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
		this.logger?.debug('Register callback', this.callbacks.length);
		return this.callbacks.push([channel, callback]);
	}

	/**
	 * Unregisters/Removes a callback from a channel
	 * with the given callback id from the {@link MockServer.register} function.
	 *
	 * @param id - the callback id returned by the {@link MockServer.register} function
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
		this.logger?.debug('Unregister callback', id);
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
		// prevent exposure and change of internal reference
		return [...this.connections];
	}

	/**
	 * Pushes a raw/encoded message onto all active connections.
	 * @param message - a message to push to all active connections
	 *
	 * @see {@link MockServer.send}
	 * @see {@link MockServer.sendError}
	 *
	 * @example
	 * ```ts
	 * const message: ReceiveMessage = {
	 * 	type: 'rec',
	 * 	address: channel,
	 * 	body: content,
	 * 	headers: {}
	 * };
	 * this.pushMessage(message);
	 * ```
	 */
	private pushMessage(message: Message): void {
		this.logMessage(message, 'outgoing');
		const data = JSON.stringify(message);
		this.connections.forEach(conn => conn.write(data));
	}

	/**
	 * Set up the internal event bus, register all necessary event calls
	 * for incoming connections and attach it to the internal HTTP server instance.
	 *
	 * @param prefix - the prefix under which you can reach the event bus,
	 * defaults to `/bridge`
	 *
	 * @example
	 * ```ts
	 * constructor(options) {
	 * 	this.connections = [];
	 * 	this.callbacks = [];
	 *
	 * 	this.eventBus = sockjs.createServer();
	 * 	this.httpServer = http.createServer();
	 * 	this.setupEventBus(options.prefix);
	 * }
	 * ```
	 */
	private setupEventBus(prefix = '/bridge'): void {
		// define handlers
		this.eventBus.on('connection', conn => {
			this.logger?.info(
				`New connection ${conn.id}`,
				`with host ${conn.remoteAddress}:${conn.remotePort}`,
				`using ${conn.protocol}`
			);
			this.connections = [...this.connections, conn];
			// handle incoming messages
			conn.on('data', data => this.handleData(conn, data));
			conn.on('close', () => this.handleClose(conn));

			// inform upper layer
			this.onConnection?.(conn);
		});

		// install handlers on http server
		this.logger?.debug(
			`Install event bus handlers on http server route ${prefix}`
		);
		this.eventBus.installHandlers(this.httpServer, { prefix });
	}

	/**
	 * Handles the incoming data, decodes them, sorts them
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
		const message: Message = JSON.parse(data);
		this.logMessage(message, 'incoming');
		if (this.onMessage?.(message)) return;

		// filter for send and publish messages
		if (message.type === 'send' || message.type === 'publish') {
			this.processMessage(conn, message);
		} else if (message.type === 'rec') {
			// 'rec' messages are only valid from backend to frontend
			this.logger?.warn(
				"Received 'rec' message from client. Something nasty is going on here...",
				message
			);
		}
	}

	/**
	 * Handles the closed event on the current connection.
	 * Removes the given connection from the connection list
	 * and calls the connection closed hook.
	 *
	 * @param conn - the closed connection
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
		this.logger?.info(`Connection ${conn.id} closed`);
		this.connections = this.connections.filter(current => current !== conn);
		this.onClosedConnection?.(conn);
	}

	/**
	 * Processes the received message, determines the type,
	 * builds the arguments for the callbacks
	 * and calls all registered callbacks on the message channel.
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
			respond: this.buildRespondHandler(conn, message)
		};

		this.callbacks.forEach(([channel, callback]) => {
			if (channel === message.address) {
				callback(args);
			}
		});
	}

	/**
	 * Builds the `respond` handler for a 'send' message.
	 * @param conn - the connection the message came from
	 * @param message - the 'send' message for which the `respond` handler gets built
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
	private buildRespondHandler(
		conn: Connection,
		message: SendMessage | PublishMessage
	): (response: JsonSerializable) => void {
		return response => {
			if (message.replyAddress) {
				const responseMessage: ReceiveMessage = {
					type: 'rec',
					address: message.replyAddress,
					body: response,
					headers: {}
				};
				this.logMessage(responseMessage, 'outgoing');
				conn.write(JSON.stringify(responseMessage));
			} else {
				this.logger?.warn(
					`Reply address for 'send' message on channel ${message.address} is not available`,
					JSON.stringify(message)
				);
			}
		};
	}

	/**
	 * Logs the given message properly formatted
	 * to the mock server logging facility.
	 *
	 * @param message - the message to format and log
	 * @param direction - the direction the message is going or coming from
	 *
	 * @see {@link MockServer.send}
	 * @see {@link MockServer.sendError}
	 * @see {@link MockServer.handleData}
	 * @see {@link MockServer.buildRespondHandler}
	 *
	 * @example
	 * ```ts
	 * const message: Message = JSON.parse(data);
	 * this.logMessage(message, 'incoming');
	 * ```
	 */
	private logMessage(
		message: Message,
		direction: 'incoming' | 'outgoing'
	): void {
		const map = {
			incoming: '--->',
			outgoing: '<---'
		};

		if (message.type === 'ping') {
			this.logger?.debug(map[direction], '[ping]');
		} else if (message.type === 'err') {
			this.logger?.debug(
				map[direction],
				'[err]',
				`{${message.failureCode}} ${message.failureType} - ${message.message}`
			);
		} else {
			this.logger?.debug(
				map[direction],
				`[${message.type}]`,
				message.address,
				'body' in message ? `# ${JSON.stringify(message.body)}` : ''
			);
		}
	}
}
