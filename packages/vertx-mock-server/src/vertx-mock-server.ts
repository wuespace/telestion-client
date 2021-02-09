/* eslint-disable no-console */
import http from 'http';
import sockjs from 'sockjs';

export class VertxMockServer {
	private readonly eventBus: sockjs.Server;

	/**
	 * The generated http server where sockjs attaches to.
	 */
	private readonly httpServer: http.Server;

	constructor(prefix = '/bridge') {
		this.eventBus = sockjs.createServer();
		this.httpServer = http.createServer();
		this.setupEventBus(prefix);
	}

	listen(port = 9870, hostname = '0.0.0.0'): void {
		this.httpServer.listen(port, hostname);
	}

	private setupEventBus(prefix: string): void {
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
		this.eventBus.installHandlers(this.httpServer, { prefix });
	}
}
