import SockJS from 'sockjs-client';
import { VertxMockServer } from './vertx-mock-server';

const PORT = 45632;
const PREFIX = '/bridge';
const HOSTNAME = 'localhost';

describe('Vert.X Mock Server', () => {
	let server: VertxMockServer;

	beforeEach(() => {
		server = new VertxMockServer(PREFIX);
	});

	describe('Simple tasks', () => {
		it('should successfully connect', () =>
			new Promise<void | string>(done => {
				server.listen(PORT, HOSTNAME);

				const client = new SockJS(`http://${HOSTNAME}:${PORT}${PREFIX}`);
				client.onopen = () => {
					expect(client.readyState).toBe(SockJS.OPEN);
					done();
				};
				client.onclose = () => {
					done('Cannot connect');
				};
			}));
	});

	afterEach(() => {
		server.close();
	});
});
