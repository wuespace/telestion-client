/* eslint-disable no-console */
import http from 'http';
import sockjs from 'sockjs';

export class VertxMockServer {
	private readonly eventBus: sockjs.Server;

	/**
	 * The generated http server where sockjs attaches to.
	 */
	private readonly httpServer: http.Server;

	constructor() {
		this.eventBus = sockjs.createServer();
		this.httpServer = http.createServer();
		this.setupEventBus();
	}

	listen(port = 9870): void {
		this.httpServer.listen(port, '0.0.0.0');
	}

	private setupEventBus(): void {
		// define handlers
		this.eventBus.on('connection', conn => {
			console.log('Event bus opened');

			conn.on('data', message => {
				console.log(JSON.stringify(message));
			});
			conn.on('close', () => {
				console.log('Event bus closed');
			});
		});

		// install handlers
		this.eventBus.installHandlers(this.httpServer, { prefix: 'bridge' });
	}
}
