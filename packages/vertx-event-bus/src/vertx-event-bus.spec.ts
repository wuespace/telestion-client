/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
	ChannelAddress,
	JsonSerializable,
	Message,
	Options,
	ReceiveMessage
} from '@wuespace/telestion-client-types';
import { randInt, randomString } from '../tests/lib';
import { ConnectionState } from './model';
import {
	errorMessage,
	publishMessage,
	registerMessage,
	unregisterMessage
} from './lib';
// mocks
import { BasicEventBus } from './basic-event-bus';
// test subject
import { EventBus } from './vertx-event-bus';

jest.mock('./basic-event-bus');

const mockedBus = jest.mocked(BasicEventBus);

const DEFAULT_URL = 'http://localhost:9870/bridge';

describe('Vert.x Event Bus', () => {
	beforeEach(() => {
		mockedBus.mockClear();
		// @ts-ignore
		// noinspection JSConstantReassignment
		mockedBus.prototype.options = {};
	});

	describe('Bus Management', () => {
		it('should create a basic event bus instance', () => {
			const eventBus = new EventBus(DEFAULT_URL);

			// cleanup
			eventBus.close();

			expect(mockedBus).toHaveBeenCalledTimes(1);
		});

		it('should pass through url and bus options', () => {
			const options: Partial<Options> = {
				autoReconnect: true,
				pingInterval: 5000
			};
			const eventBus = new EventBus(DEFAULT_URL, options);

			// cleanup
			eventBus.close();

			expect(mockedBus).toBeCalledWith(DEFAULT_URL, options);
		});

		it('should call onOpen handler on bus open', () => {
			const openHandler = jest.fn();
			const eventBus = new EventBus(DEFAULT_URL);
			const instance = mockedBus.mock.instances[0];

			// register
			eventBus.onOpen = openHandler;

			// call internal event
			instance.onOpen?.();

			// cleanup
			eventBus.close();

			expect(openHandler).toHaveBeenCalledTimes(1);
		});

		it('should call onClose handler on bus close', () => {
			const closeHandler = jest.fn();
			const eventBus = new EventBus(DEFAULT_URL);
			const instance = mockedBus.mock.instances[0];

			// register
			eventBus.onClose = closeHandler;

			// call internal event
			instance.onClose?.();

			// cleanup
			eventBus.close();

			expect(closeHandler).toHaveBeenCalledTimes(1);
		});

		it('should call onReconnect handler on bus reconnect', () => {
			const reconnectHandler = jest.fn();
			const eventBus = new EventBus(DEFAULT_URL);
			const instance = mockedBus.mock.instances[0];

			// register
			eventBus.onReconnect = reconnectHandler;

			// call internal event
			instance.onReconnect?.();

			// cleanup
			eventBus.close();

			expect(reconnectHandler).toHaveBeenCalledTimes(1);
		});

		it('should call onMessage handler on bus message', () => {
			const message: Message = {
				type: 'register',
				address: 'some-address',
				headers: {}
			};
			const messageHandler = jest.fn();
			const eventBus = new EventBus(DEFAULT_URL);
			const instance = mockedBus.mock.instances[0];

			// register
			eventBus.onMessage = messageHandler;

			// call internal event
			instance.onMessage?.(message);

			// cleanup
			eventBus.close();

			expect(messageHandler).toHaveBeenCalledTimes(1);
			expect(messageHandler).toBeCalledWith(message);
		});

		it('should call onError on bus error message', () => {
			const message = errorMessage(
				randInt(1, 10),
				randomString(10),
				randomString(40)
			);

			const errorHandler = jest.fn();
			const eventBus = new EventBus(DEFAULT_URL);
			const instance = mockedBus.mock.instances[0];

			// register
			eventBus.onError = errorHandler;

			instance.onMessage?.(message);

			// cleanup
			eventBus.close();

			expect(errorHandler).toBeCalledTimes(1);
			expect(errorHandler).lastCalledWith(message);
		});

		it('should close bus on explicit close', () => {
			const eventBus = new EventBus(DEFAULT_URL);
			const instance = mockedBus.mock.instances[0];

			// cleanup
			eventBus.close();

			expect(instance.close).toHaveBeenCalledTimes(1);
		});
	});

	describe('Setup and Monitoring', () => {
		it('should return options from the bus', () => {
			const options: Options = {
				autoReconnect: true,
				pingInterval: 2000,
				reconnectAttempts: Infinity,
				reconnectExponent: 2,
				delayMin: 10,
				delayMax: 2000,
				randomizationFactor: 0.5
			};
			const eventBus = new EventBus(DEFAULT_URL);
			const instance = mockedBus.mock.instances[0];

			// mock
			// @ts-ignore
			// noinspection JSConstantReassignment
			instance.options = options;

			// cleanup
			eventBus.close();

			expect(eventBus.options).toBe(options);
		});

		it('should return the url from the bus', () => {
			const eventBus = new EventBus(DEFAULT_URL);
			const instance = mockedBus.mock.instances[0];

			// @ts-ignore
			// noinspection JSConstantReassignment
			instance.url = DEFAULT_URL;

			// cleanup
			eventBus.close();

			expect(eventBus.url).toBe(DEFAULT_URL);
		});

		it('should return the state from the bus', () => {
			const rand = randInt(0, 3);

			const eventBus = new EventBus(DEFAULT_URL);
			const instance = mockedBus.mock.instances[0];

			// @ts-ignore
			instance.state = ConnectionState[rand];

			// cleanup
			eventBus.close();

			expect(eventBus.state).toBe(ConnectionState[rand]);
		});

		it('should return the reconnect attempts from the bus', () => {
			const rand = randInt(0, 100);

			const eventBus = new EventBus(DEFAULT_URL);
			const instance = mockedBus.mock.instances[0];

			instance.reconnectAttempts = rand;

			// cleanup
			eventBus.close();

			expect(eventBus.reconnectAttempts).toBe(rand);
		});

		it('should return the sent message counter from the bus', () => {
			const rand = randInt(0, 200);

			const eventBus = new EventBus(DEFAULT_URL);
			const instance = mockedBus.mock.instances[0];

			instance.sentMessages = rand;

			// cleanup
			eventBus.close();

			expect(eventBus.sentMessages).toBe(rand);
		});

		it('should return the received message counter from the bus', () => {
			const rand = randInt(0, 200);

			const eventBus = new EventBus(DEFAULT_URL);
			const instance = mockedBus.mock.instances[0];

			instance.receivedMessages = rand;

			// cleanup
			eventBus.close();

			expect(eventBus.receivedMessages).toBe(rand);
		});

		it('should return the auto reconnect state from the bus', () => {
			const state = Math.random() >= 0.5;

			const eventBus = new EventBus(DEFAULT_URL);
			const instance = mockedBus.mock.instances[0];

			instance.autoReconnect = state;

			// cleanup
			eventBus.close();

			expect(eventBus.autoReconnect).toBe(state);
		});

		it('should set the auto reconnect state on the bus', () => {
			const state = Math.random() >= 0.5;

			const eventBus = new EventBus(DEFAULT_URL);
			const instance = mockedBus.mock.instances[0];

			eventBus.setAutoReconnect(state);

			// cleanup
			eventBus.close();

			expect(instance.autoReconnect).toBe(state);
		});
	});

	describe('Message Handling', () => {
		it('should only send a register message on the first register', () => {
			const channel: ChannelAddress = randomString(10);
			const count = randInt(1, 5);

			const eventBus = new EventBus(DEFAULT_URL);
			const instance = mockedBus.mock.instances[0];

			for (let i = 0; i < count; i++) {
				// register another handler
				eventBus.register(channel, () => {});
			}

			// cleanup
			eventBus.close();

			expect(instance.send).toBeCalledTimes(1); // only once
			expect(instance.send).lastCalledWith(registerMessage(channel), false);
		});

		it('should only send a unregister message on the last unregister', () => {
			const channel: ChannelAddress = randomString(10);
			const handlers: Array<() => void> = [];
			const count = randInt(1, 5);

			const eventBus = new EventBus(DEFAULT_URL);
			const instance = mockedBus.mock.instances[0];

			// first register some handlers
			for (let i = 0; i < count; i++) {
				handlers[i] = () => {};
				eventBus.register(channel, handlers[i]);
			}

			// and unregister again
			for (let i = 0; i < count; i++) {
				eventBus.unregister(channel, handlers[i]);
			}

			// cleanup
			eventBus.close();

			expect(instance.send).toBeCalledTimes(2);
			expect(instance.send).lastCalledWith(unregisterMessage(channel), false);
		});

		it('should send register messages on bus "open" event', () => {
			const count = randInt(1, 10);
			const channels: Array<ChannelAddress> = [];

			const eventBus = new EventBus(DEFAULT_URL);
			const instance = mockedBus.mock.instances[0];

			// register some handlers
			for (let i = 0; i < count; i++) {
				channels[i] = randomString(10);
				eventBus.register(channels[i], () => {});
			}

			expect(instance.send).toBeCalledTimes(count);
			instance.send = jest.fn();

			// open event bus
			instance.onOpen?.();

			// cleanup
			eventBus.close();

			expect(instance.send).toBeCalledTimes(count);
			for (let i = 0; i < count; i++) {
				expect(instance.send).nthCalledWith(
					i + 1,
					registerMessage(channels[i]),
					false
				);
			}
		});

		it('should call all registered event handlers on an incoming message', () => {
			const registerCount = randInt(2, 10);
			const messageCount = randInt(3, 10);
			const handlers: Array<() => any> = [];
			const channel: ChannelAddress = randomString(10);

			const eventBus = new EventBus(DEFAULT_URL);
			const instance = mockedBus.mock.instances[0];

			// register event handlers
			for (let i = 0; i < registerCount; i++) {
				handlers[i] = jest.fn();
				eventBus.register(channel, handlers[i]);
			}

			const content = randomString(30);
			const message: ReceiveMessage = {
				type: 'rec',
				address: channel,
				body: content,
				headers: {}
			};
			// send messageCount messages
			for (let i = 0; i < messageCount; i++) {
				instance.onMessage?.(message);
			}

			// cleanup
			eventBus.close();

			for (let i = 0; i < registerCount; i++) {
				expect(handlers[i]).toBeCalledTimes(messageCount);
				expect(handlers[i]).lastCalledWith(content);
			}
		});

		it('should call all registered event handlers on different channels', () => {
			const registerCount = randInt(2, 10);
			const handlers: Array<() => any> = [];
			const channels: Array<ChannelAddress> = [];
			const contents: Array<JsonSerializable> = [];

			const eventBus = new EventBus(DEFAULT_URL);
			const instance = mockedBus.mock.instances[0];

			// register event handlers
			for (let i = 0; i < registerCount; i++) {
				handlers[i] = jest.fn();
				channels[i] = randomString(10);
				eventBus.register(channels[i], handlers[i]);
			}

			for (let i = 0; i < registerCount; i++) {
				contents[i] = randomString(30);
				const message: ReceiveMessage = {
					type: 'rec',
					address: channels[i],
					body: contents[i],
					headers: {}
				};
				// send message on specific channel
				instance.onMessage?.(message);
			}

			// cleanup
			eventBus.close();

			for (let i = 0; i < registerCount; i++) {
				expect(handlers[i]).toBeCalledTimes(1);
				expect(handlers[i]).lastCalledWith(contents[i]);
			}
		});

		it('should use send function on publish call', () => {
			const address = randomString(10);
			const content = randomString(50);

			const eventBus = new EventBus(DEFAULT_URL);
			const instance = mockedBus.mock.instances[0];

			// publish content on address
			eventBus.publish(address, content);

			// cleanup
			eventBus.close();

			expect(instance.send).toBeCalledTimes(1);
			expect(instance.send).lastCalledWith(publishMessage(address, content));
		});

		it('should use send function and register callback on send call', () => {
			const count = randInt(2, 10);
			const handlers: Array<() => any> = [];
			const contents: Array<string> = [];

			const eventBus = new EventBus(DEFAULT_URL);
			const instance = mockedBus.mock.instances[0];

			// overwrite for this specific instance (I now, this annoying)
			instance.send = message => {
				if (message.type === 'send' && message.replyAddress) {
					const returnMessage: ReceiveMessage = {
						type: 'rec',
						address: message.replyAddress,
						body: message.body,
						headers: {}
					};

					// call random times
					const calls = randInt(1, 5);

					for (let i = 0; i < calls; i++) {
						// Only one call should trigger registered handler,
						// but hey, we send more messages!
						instance.onMessage?.(returnMessage);
					}
				}
			};

			// send and register handlers
			for (let i = 0; i < count; i++) {
				handlers[i] = jest.fn();
				contents[i] = randomString(50);
				eventBus.send(randomString(10), contents[i], handlers[i]);
			}

			// cleanup
			eventBus.close();

			for (let i = 0; i < count; i++) {
				// send handlers should only be called once!
				expect(handlers[i]).toBeCalledTimes(1);
				expect(handlers[i]).lastCalledWith(contents[i]);
			}
		});
	});
});
