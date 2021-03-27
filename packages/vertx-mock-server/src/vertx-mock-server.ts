import http from 'http';
import sockjs, { Connection } from 'sockjs';
import {
	ChannelAddress,
	JsonSerializable,
	PublishMessage,
	SendMessage
} from '@wuespace/telestion-client-types';

import {
	SendHandlerId,
	PublishHandlerId,
	SendHandler,
	PublishHandler,
	ErrorContent,
	ListenOptions
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
	 * Holds all registered send handlers
	 */
	private readonly sendHandlers: Array<
		readonly [channel: ChannelAddress, callback: SendHandler]
	>;

	private readonly publishHandlers: Array<
		readonly [channel: ChannelAddress, callback: PublishHandler]
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

	onMessage?(message: JsonSerializable): void;

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
		this.sendHandlers = [];
		this.publishHandlers = [];

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

	protected handle(
		channel: ChannelAddress,
		callback: SendHandler
	): SendHandlerId {
		return this.sendHandlers.push([channel, callback]);
	}

	protected unhandle(id: SendHandlerId): void {
		delete this.sendHandlers[id];
	}

	protected register(
		channel: ChannelAddress,
		callback: PublishHandler
	): PublishHandlerId {
		return this.publishHandlers.push([channel, callback]);
	}

	protected unregister(id: PublishHandlerId): void {
		delete this.publishHandlers[id];
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

	private pushMessage(data: string): void {
		this.connections.forEach(conn => conn.write(data));
	}

	private handleData(conn: Connection, data: string): void {
		const message = decodeMessage(data);
		// filter for send and publish messages
		if (message.type === 'send') {
			this.onMessage?.(message.body);
			this.processSendMessage(conn, message);
		} else if (message.type === 'publish') {
			this.onMessage?.(message.body);
			this.processPublishMessage(message);
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

	private processSendMessage(conn: Connection, message: SendMessage): void {
		// handle response from hook
		const handleRespond: (response: JsonSerializable) => void = response => {
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

		// loop through registered handlers and pick the right ones
		this.sendHandlers.forEach(([channel, callback]) => {
			if (channel === message.address) {
				callback(message.body, handleRespond);
			}
		});
	}

	private processPublishMessage(message: PublishMessage): void {
		// loop through registered handlers and pick the right ones
		this.publishHandlers.forEach(([channel, callback]) => {
			if (channel === message.address) {
				callback(message.body);
			}
		});
	}
}
