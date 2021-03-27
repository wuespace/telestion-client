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

	listen({ port = 9870, hostname = '0.0.0.0' }: ListenOptions): void {
		this.httpServer.listen(port, hostname);
		this.onInit?.();
	}

	close(): Promise<void> {
		this.onClose?.();
		return new Promise<void>((resolve, reject) =>
			this.httpServer.close(err => (err ? reject(err) : resolve()))
		);
	}

	protected send(channel: ChannelAddress, message: JsonSerializable): void {
		this.pushMessage(encodeReceiveMessage(channel, message));
	}

	protected sendError(channel: ChannelAddress, error: ErrorContent): void {
		this.pushMessage(encodeErrorMessage(channel, error));
	}

	protected register(channel: ChannelAddress, callback: Callback): CallbackId {
		return this.callbacks.push([channel, callback]);
	}

	protected unregister(id: CallbackId): void {
		delete this.callbacks[id];
	}

	protected getConnections(): Array<Connection> {
		return [...this.connections];
	}

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

	private handleClose(conn: Connection): void {
		this.connections = this.connections.filter(current => current !== conn);
		this.onClosedConnection?.(conn);
	}

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

	private pushMessage(data: string): void {
		this.connections.forEach(conn => conn.write(data));
	}
}
