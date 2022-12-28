/* eslint-disable @typescript-eslint/ban-ts-comment,import/order */
import { sampleMessages } from '../tests/constants';
import { randInt, nonJsonString } from '../tests/lib';
// mocks
import SockJS from 'sockjs-client';
import { validate } from './lib';
// test subject
import { BasicEventBus } from './basic-event-bus';
import { ConnectionState } from './model';

jest.mock('sockjs-client');
jest.mock('./lib/validator');

const mockedSockJS = jest.mocked(SockJS);
const mockedValidate = jest.mocked(validate, { shallow: true });

const DEFAULT_URL = 'http://localhost:9870/bridge';

describe('Basic event bus', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		mockedSockJS.mockClear();
		mockedValidate.mockClear();
		// validator always accepts (default)
		mockedValidate.mockReturnValue(true);
	});

	describe('Socket usage', () => {
		it('should create a socket on startup', () => {
			const eventBus = new BasicEventBus(DEFAULT_URL);

			// cleanup
			eventBus.close();

			expect(mockedSockJS).toHaveBeenCalledTimes(1);
			expect(mockedSockJS).toBeCalledWith(DEFAULT_URL);
		});

		it('should call onOpen handler on socket open', () => {
			const openHandler = jest.fn();
			const eventBus = new BasicEventBus(DEFAULT_URL);
			const instance = mockedSockJS.mock.instances[0];
			eventBus.onOpen = openHandler;

			// trigger open event
			// @ts-ignore
			instance.onopen?.();

			// cleanup
			eventBus.close();

			expect(openHandler).toHaveBeenCalledTimes(1);
		});

		it('should call onMessage on socket receive', () => {
			const count = randInt(1, 10);

			const messageHandler = jest.fn();
			const eventBus = new BasicEventBus(DEFAULT_URL);
			const instance = mockedSockJS.mock.instances[0];
			eventBus.onMessage = messageHandler;

			for (let i = 0; i < count; i++) {
				// @ts-ignore
				instance.onmessage?.({ data: '{"type":"ping"}' });
			}

			// unregister event handler
			eventBus.onMessage = undefined;

			// send scrambled message without event handler
			// to silence jest branch detector
			// @ts-ignore
			instance.onmessage?.({ data: nonJsonString() });

			// send valid JSON and invalid message without event handler
			// to silence jest branch detector
			mockedValidate.mockReturnValue(false);
			// @ts-ignore
			instance.onmessage?.({ data: 'null' });

			// cleanup
			eventBus.close();

			expect(messageHandler).toHaveBeenCalledTimes(count);
		});

		it('should call onClose handler on socket close', () => {
			const closeHandler = jest.fn();
			const eventBus = new BasicEventBus(DEFAULT_URL);
			const instance = mockedSockJS.mock.instances[0];
			eventBus.onClose = closeHandler;

			// trigger close event
			// @ts-ignore
			instance.onclose?.();

			// cleanup
			eventBus.close();

			expect(closeHandler).toHaveBeenCalledTimes(1);
		});

		it('should call onReconnect handler on new socket open', () => {
			const reconnectHandler = jest.fn();
			const eventBus = new BasicEventBus(DEFAULT_URL);
			const instance1 = mockedSockJS.mock.instances[0];
			eventBus.onReconnect = reconnectHandler;

			// @ts-ignore
			instance1.onclose?.();

			// fast forward
			jest.runOnlyPendingTimers();
			const instance2 = mockedSockJS.mock.instances[1];

			// @ts-ignore
			instance2.onopen?.();

			// cleanup
			eventBus.close();

			expect(reconnectHandler).toHaveBeenCalledTimes(1);
		});

		it('should create a new socket on reconnect', () => {
			const eventBus = new BasicEventBus(DEFAULT_URL);
			const instance = mockedSockJS.mock.instances[0];

			// socket could not open -> call close event
			// @ts-ignore
			instance.onclose?.();

			// wait for timeout
			jest.runOnlyPendingTimers();

			// cleanup
			eventBus.close();

			expect(mockedSockJS).toHaveBeenCalledTimes(2);
		});

		it('should create all sockets with the given url', () => {
			const eventBus = new BasicEventBus(DEFAULT_URL);
			const instance1 = mockedSockJS.mock.instances[0];

			// @ts-ignore
			instance1.onclose?.();

			// fast forward
			jest.runOnlyPendingTimers();

			// cleanup
			eventBus.close();

			expect(mockedSockJS).nthCalledWith(1, DEFAULT_URL);
			expect(mockedSockJS).nthCalledWith(2, DEFAULT_URL);
		});

		it('should close the socket on explicit close', () => {
			const eventBus = new BasicEventBus(DEFAULT_URL);
			const instance = mockedSockJS.mock.instances[0];

			// cleanup
			eventBus.close();

			expect(instance.close).toHaveBeenCalledTimes(1);
			expect(mockedSockJS).toHaveBeenCalledTimes(1);
		});

		it('should call socket send on message send', () => {
			const eventBus = new BasicEventBus(DEFAULT_URL);
			const instance = mockedSockJS.mock.instances[0];

			// trigger open event
			// @ts-ignore
			instance.onopen?.();

			// send simple message
			eventBus.send({ type: 'ping' });

			// cleanup
			eventBus.close();

			expect(instance.send).toHaveBeenCalledTimes(1);
		});

		it('should return the current socket state', () => {
			const eventBus = new BasicEventBus(DEFAULT_URL);
			const instance = mockedSockJS.mock.instances[0];

			// @ts-ignore
			// noinspection JSConstantReassignment
			instance.readyState = SockJS.CONNECTING;
			expect(eventBus.state).toBe(ConnectionState.CONNECTING);

			// @ts-ignore
			// noinspection JSConstantReassignment
			instance.readyState = SockJS.OPEN;
			expect(eventBus.state).toBe(ConnectionState.OPEN);

			// @ts-ignore
			// noinspection JSConstantReassignment
			instance.readyState = SockJS.CLOSING;
			expect(eventBus.state).toBe(ConnectionState.CLOSING);

			// @ts-ignore
			// noinspection JSConstantReassignment
			instance.readyState = SockJS.CLOSED;
			expect(eventBus.state).toBe(ConnectionState.CLOSED);

			// cleanup
			eventBus.close();
		});
	});

	describe('Setup and Monitoring', () => {
		it('should not automatically reconnect when initially disabled', () => {
			const eventBus = new BasicEventBus(DEFAULT_URL, { autoReconnect: false });
			const instance = mockedSockJS.mock.instances[0];

			// @ts-ignore
			instance.onopen?.();

			// fast forward
			jest.runOnlyPendingTimers();

			// @ts-ignore
			instance.onclose?.();

			// fast forward
			jest.runOnlyPendingTimers();

			expect(mockedSockJS).toHaveBeenCalledTimes(1);
			expect(eventBus.autoReconnect).toBe(false);
		});

		it('should not automatically reconnect when on open disabled', () => {
			const eventBus = new BasicEventBus(DEFAULT_URL);
			const instance = mockedSockJS.mock.instances[0];

			// @ts-ignore
			instance.onopen?.();

			// fast forward
			jest.runOnlyPendingTimers();

			// set before closed socket
			eventBus.autoReconnect = false;

			// fast forward
			jest.runOnlyPendingTimers();

			// @ts-ignore
			instance.onclose?.();

			// fast forward
			jest.runOnlyPendingTimers();

			expect(mockedSockJS).toHaveBeenCalledTimes(1);
		});

		it('should not automatically reconnect when on closed disabled', () => {
			const eventBus = new BasicEventBus(DEFAULT_URL);
			const instance = mockedSockJS.mock.instances[0];

			// @ts-ignore
			instance.onopen?.();

			// fast forward
			jest.runOnlyPendingTimers();

			// @ts-ignore
			instance.onclose?.();

			// set after closed socket
			eventBus.autoReconnect = false;

			// fast forward
			jest.runOnlyPendingTimers();

			expect(mockedSockJS).toHaveBeenCalledTimes(1);
		});

		it('should not try to reconnect if reconnect limit is reached', () => {
			const count = randInt(1, 5);
			const additional = randInt(1, 5);

			const eventBus = new BasicEventBus(DEFAULT_URL, {
				reconnectAttempts: count
			});

			for (let i = 0; i < count + additional; i++) {
				const instance = mockedSockJS.mock.instances[i];
				// @ts-ignore
				instance?.onclose?.();

				// fast forward
				jest.runOnlyPendingTimers();
			}

			expect(eventBus.reconnectAttempts).toBe(count);
		});

		it('should increase reconnect attempts on reconnecting attempts', () => {
			const count = randInt(10, 30);
			const eventBus = new BasicEventBus(DEFAULT_URL);

			for (let i = 0; i < count; i++) {
				const instance = mockedSockJS.mock.instances[i];
				// @ts-ignore
				instance.onclose?.();
				jest.runOnlyPendingTimers();
			}

			// cleanup
			eventBus.close();

			expect(eventBus.reconnectAttempts).toBe(count);
		});

		it('should reset reconnect attempts on successful connection', () => {
			const count = randInt(10, 30);
			const eventBus = new BasicEventBus(DEFAULT_URL);

			for (let i = 0; i < count; i++) {
				const instance = mockedSockJS.mock.instances[i];
				// @ts-ignore
				instance.onclose?.();
				jest.runOnlyPendingTimers();
			}

			const instance = mockedSockJS.mock.instances[count];
			// @ts-ignore
			instance.onopen?.();

			// cleanup
			eventBus.close();

			expect(eventBus.reconnectAttempts).toBe(0);
		});

		it('should increase send message counter on sent messages', () => {
			const count = randInt(1, 30);
			const eventBus = new BasicEventBus(DEFAULT_URL);
			const instance = mockedSockJS.mock.instances[0];

			// @ts-ignore
			instance.onopen?.();

			for (let i = 0; i < count; i++) {
				eventBus.send({ type: 'ping' });
			}

			// cleanup
			eventBus.close();

			expect(eventBus.sentMessages).toBe(count);
		});

		it('should increase received message counter on received messages', () => {
			const count = randInt(1, 30);
			const eventBus = new BasicEventBus(DEFAULT_URL);
			const instance = mockedSockJS.mock.instances[0];

			// @ts-ignore
			instance.onopen?.();

			for (let i = 0; i < count; i++) {
				// @ts-ignore
				instance.onmessage?.({ data: '{"type":"ping"}' });
			}

			// cleanup
			eventBus.close();

			expect(eventBus.receivedMessages).toBe(count);
		});

		it('should set instance url to the constructor url', () => {
			const eventBus = new BasicEventBus(DEFAULT_URL);

			// cleanup
			eventBus.close();

			expect(eventBus.url).toBe(DEFAULT_URL);
		});

		it('should reconnect in regular intervals when no randomization factor is set', () => {
			const count = randInt(5, 15);

			const eventBus = new BasicEventBus(DEFAULT_URL, {
				delayMin: 100 /* ms */,
				delayMax: Infinity /* ms */,
				reconnectExponent: 2,
				randomizationFactor: 0
			});

			for (let i = 0; i < count; i++) {
				const instance = mockedSockJS.mock.instances[i];
				// @ts-ignore
				instance.onclose?.();

				// fast forward
				jest.advanceTimersByTime(100 * i ** 2);
			}

			// cleanup
			eventBus.close();
		});
	});

	describe('Message conversion', () => {
		it('should send ping messages on an open socket', () => {
			const count = randInt(10, 50);
			const eventBus = new BasicEventBus(DEFAULT_URL);
			const instance = mockedSockJS.mock.instances[0];

			// trigger open event
			// @ts-ignore
			instance.onopen?.();

			for (let i = 0; i < count; i++) {
				// fast forward
				jest.runOnlyPendingTimers();
			}

			expect(instance.send).toHaveBeenCalledTimes(count);
			expect(instance.send).toBeCalledWith('{"type":"ping"}');

			// trigger close event
			// @ts-ignore
			instance.onclose?.();

			// fast forward another round
			jest.runOnlyPendingTimers();

			// cleanup
			eventBus.close();

			expect(instance.send).toHaveBeenCalledTimes(count);
			expect(instance.send).toBeCalledWith('{"type":"ping"}');
		});

		it('should send the message encoded on an open socket', () => {
			const count = randInt(5, 15);
			const eventBus = new BasicEventBus(DEFAULT_URL);
			const instance = mockedSockJS.mock.instances[0];

			// @ts-ignore
			instance.onopen?.();

			for (let i = 0; i < count; i++) {
				const sample = sampleMessages[randInt(0, sampleMessages.length - 1)];
				eventBus.send(sample[0]);
				expect(instance.send).lastCalledWith(sample[1]);
			}

			// cleanup
			eventBus.close();
		});

		it('should store the message and send on the next open socket', () => {
			const count = randInt(5, 15);

			// build mock
			for (let i = 0; i < count; i++) {
				mockedSockJS.prototype.send.mockImplementationOnce(() => {
					throw new Error('Socket not open');
				});
			}
			mockedSockJS.prototype.send.mockImplementation(() => {});

			const eventBus = new BasicEventBus(DEFAULT_URL);
			const instance = mockedSockJS.mock.instances[0];

			for (let i = 0; i < count; i++) {
				const sample = sampleMessages[randInt(0, sampleMessages.length - 1)];
				eventBus.send(sample[0]);
				expect(instance.send).lastCalledWith(sample[1]);
			}

			expect(instance.send).toHaveBeenCalledTimes(count);

			// @ts-ignore
			instance.onopen?.();

			// cleanup
			eventBus.close();

			expect(instance.send).toHaveBeenCalledTimes(2 * count);
		});

		it('should not store the message and not send on next open socket', () => {
			const count = randInt(5, 15);

			// build mock
			for (let i = 0; i < count; i++) {
				mockedSockJS.prototype.send.mockImplementationOnce(() => {
					throw new Error('Socket not open');
				});
			}
			mockedSockJS.prototype.send.mockImplementation(() => {});

			const eventBus = new BasicEventBus(DEFAULT_URL);
			const instance = mockedSockJS.mock.instances[0];

			for (let i = 0; i < count; i++) {
				const sample = sampleMessages[randInt(0, sampleMessages.length - 1)];
				eventBus.send(sample[0], false);
				expect(instance.send).lastCalledWith(sample[1]);
			}

			expect(instance.send).toHaveBeenCalledTimes(count);

			// @ts-ignore
			instance.onopen?.();

			// cleanup
			eventBus.close();

			expect(instance.send).toHaveBeenCalledTimes(count);
		});

		it('should send as much messages as possible when socket open', () => {
			const count = randInt(10, 20);
			const possible = randInt(3, count - 1);

			// console.log('Count:', count);
			// console.log('Possible:', possible);
			// console.log('Remains:', count - possible);

			// first, not allowed (event bus not open yet)
			for (let i = 0; i < count; i++) {
				mockedSockJS.prototype.send.mockImplementationOnce(() => {
					throw new Error('Socket not open');
				});
			}
			// then, it's allowed for some messages (possible-times)
			for (let i = 0; i < possible; i++) {
				mockedSockJS.prototype.send.mockImplementationOnce(() => {});
			}
			// finally, not allowed anymore ("connection lost")
			mockedSockJS.prototype.send.mockImplementation(() => {
				throw new Error('Socket not open');
			});

			const eventBus = new BasicEventBus(DEFAULT_URL);
			const instance1 = mockedSockJS.mock.instances[0];

			for (let i = 0; i < count; i++) {
				const sample = sampleMessages[randInt(0, sampleMessages.length - 1)];
				eventBus.send(sample[0]);
			}

			expect(instance1.send).toHaveBeenCalledTimes(count);

			// @ts-ignore
			instance1.onopen?.();

			// fast forward
			jest.runOnlyPendingTimers();

			expect(instance1.send).toHaveBeenCalledTimes(2 * count + 1); // +1 for ping

			// @ts-ignore
			instance1.onclose?.();

			// fast forward
			jest.runOnlyPendingTimers();

			const instance2 = mockedSockJS.mock.instances[1];

			// @ts-ignore
			instance2.onopen?.();

			// cleanup
			eventBus.close();

			// remains are sent
			expect(instance2.send).toHaveBeenCalledTimes(count - possible);
		});

		it('should give the decoded message on valid message', () => {
			const count = randInt(5, 15);
			const messageHandler = jest.fn();
			const eventBus = new BasicEventBus(DEFAULT_URL);
			eventBus.onMessage = messageHandler;
			const instance = mockedSockJS.mock.instances[0];

			// @ts-ignore
			instance.onopen?.();

			for (let i = 0; i < count; i++) {
				const sample = sampleMessages[randInt(0, sampleMessages.length - 1)];
				// @ts-ignore
				instance.onmessage?.({ data: sample[1] });
				expect(messageHandler).lastCalledWith(sample[0]);
			}
			// cleanup
			eventBus.close();
		});

		it('should give an error message on a non JSON message', () => {
			const count = randInt(5, 15);
			const messageHandler = jest.fn();
			const eventBus = new BasicEventBus(DEFAULT_URL);
			eventBus.onMessage = messageHandler;
			const instance = mockedSockJS.mock.instances[0];

			// @ts-ignore
			instance.onopen?.();

			for (let i = 0; i < count; i++) {
				const invalidData = nonJsonString();
				// @ts-ignore
				instance.onmessage?.({ data: invalidData });
				expect(messageHandler).lastCalledWith(
					expect.objectContaining({
						type: 'err',
						failureCode: 1,
						failureType: 'SyntaxError',
						message: expect.stringContaining(invalidData)
					})
				);
			}
			// cleanup
			eventBus.close();
		});

		it('should give an error message on an invalid message (validator)', () => {
			// setup validator
			mockedValidate.mockReturnValue(false);

			const count = randInt(5, 15);
			const errorsInject = randInt(2, count - 1);

			const messageHandler = jest.fn();
			const eventBus = new BasicEventBus(DEFAULT_URL);
			eventBus.onMessage = messageHandler;
			const instance = mockedSockJS.mock.instances[0];

			// @ts-ignore
			instance.onopen?.();

			for (let i = 0; i < count; i++) {
				if (i === errorsInject) {
					mockedValidate.errors = [
						// @ts-ignore
						{ message: 'Something went wrong' }
					];
				}

				const sample = sampleMessages[randInt(0, sampleMessages.length - 1)];
				// @ts-ignore
				instance.onmessage?.({ data: sample[1] });
				expect(messageHandler).lastCalledWith(
					expect.objectContaining({
						type: 'err',
						failureCode: 2,
						failureType: 'SyntaxError',
						message: expect.stringContaining(sample[1])
					})
				);
			}
			// cleanup
			eventBus.close();
		});
	});
});
