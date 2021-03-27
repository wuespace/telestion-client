import SockJS from 'sockjs-client';
import { MockServer } from './vertx-mock-server';

const PORT = 45632;
const PREFIX = '/bridge';
const HOSTNAME = 'localhost';

describe('Vert.X Mock Server', () => {
	let server: MockServer;

	beforeEach(() => {
		server = new MockServer(PREFIX);
	});

	describe('Simple tasks', () => {
		it('should successfully connect', () =>
			new Promise<void | string>(done => {
				server.listen({ port: PORT, hostname: HOSTNAME });

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
		return server.close();
	});
});
