/*
 * Rewritten, but heavily based on the vertx3-eventbus-client library.
 * Original copyright notice:
 *
 *   Copyright (c) 2011-2015 The original author or authors
 *   ------------------------------------------------------
 *   All rights reserved. This program and the accompanying materials
 *   are made available under the terms of the Eclipse Public License v1.0
 *   and Apache License v2.0 which accompanies this distribution.
 *
 *       The Eclipse Public License is available at
 *       http://www.eclipse.org/legal/epl-v10.html
 *
 *       The Apache License v2.0 is available at
 *       http://www.opensource.org/licenses/apache2.0.php
 *
 *   You may elect to redistribute this code under either of these licenses.
 */

import SockJS from 'sockjs-client';
import {
	Callback,
	Options,
	Message,
	Headers,
	AddressableMessage,
	ErrorMessage,
	SuccessMessage
} from '../model/VertxEventBus';
import InvalidSocketStateError from './InvalidSocketStateError';

const defaultOptions: Options = {
	pingInterval: 5000 /* ms */,
	reconnectAttempts: Infinity,
	reconnectExponent: 2,
	delayMin: 1000 /* ms */,
	delayMax: 5000 /* ms */,
	randomizationFactor: 0.5
};

export default class EventBus {
	static get CONNECTING() {
		return WebSocket.CONNECTING;
	}

	static get OPEN() {
		return WebSocket.OPEN;
	}

	static get CLOSING() {
		return WebSocket.CLOSING;
	}

	static get CLOSED() {
		return WebSocket.CLOSED;
	}

	static getStateName(stateId: number): string {
		switch (stateId) {
			case EventBus.CONNECTING:
				return 'CONNECTING';
			case EventBus.OPEN:
				return 'OPEN';
			case EventBus.CLOSING:
				return 'CLOSING';
			case EventBus.CLOSED:
				return 'CLOSED';
			default:
				return 'INVALID_STATE';
		}
	}

	readonly options: Options;

	private socket: WebSocket;

	private readonly handlers: { [key: string]: Array<Callback> };

	private readonly replyHandlers: { [key: string]: Callback };

	private pingTimerId: any;

	private reconnectTimerId: any;

	private reconnectEnabled: boolean;

	private reconnectAttempts: number;

	onOpen?: () => void;

	onClose?: () => void;

	onReconnect?: () => void;

	onError?: (err: ErrorMessage) => void;

	constructor(url: string, options?: Partial<Options>) {
		this.options = { ...defaultOptions, ...options };
		this.handlers = {};
		this.replyHandlers = {};
		this.reconnectEnabled = false;
		this.reconnectAttempts = 0;
		this.onError = (error: ErrorMessage) => {
			console.error(error);
		};
		this.socket = this.setupConnection(url);
	}

	get state() {
		return this.socket.readyState;
	}

	enablePing(enable: boolean) {
		const { pingInterval } = this.options;

		if (enable && pingInterval > 0) {
			this.sendPing();
			this.pingTimerId = setInterval(() => {
				this.sendPing();
			}, pingInterval);
		} else if (this.pingTimerId) {
			clearInterval(this.pingTimerId);
			this.pingTimerId = null;
		}
	}

	enableReconnect(enable: boolean) {
		this.reconnectEnabled = enable;
		if (!enable && this.reconnectTimerId) {
			clearTimeout(this.reconnectTimerId);
			this.reconnectTimerId = null;
			this.reconnectAttempts = 0;
		}
	}

	registerHandler(channel: string, callback: Callback, headers?: Headers) {
		if (this.state !== EventBus.OPEN)
			throw new InvalidSocketStateError(
				EventBus.getStateName(this.state),
				EventBus.getStateName(EventBus.OPEN)
			);

		if (!this.handlers[channel]) {
			this.handlers[channel] = [];
			// First handler for this address so we should register the connection
			this.subscribeToChannel(channel, headers);
		}

		this.handlers[channel].push(callback);
	}

	unregisterHandler(channel: string, callback: Callback, headers?: Headers) {
		if (this.state !== EventBus.OPEN)
			throw new InvalidSocketStateError(
				EventBus.getStateName(this.state),
				EventBus.getStateName(EventBus.OPEN)
			);

		const handlers = this.handlers[channel];
		if (handlers) {
			const newHandlers = handlers.filter(handler => handler !== callback);

			if (newHandlers.length > 0) {
				this.handlers[channel] = newHandlers;
			} else {
				delete this.handlers[channel];
				// No more local handlers so we should unregister the connection
				this.unsubscribeFromChannel(channel, headers);
			}
		}
	}

	publish(channel: string, message: any, headers?: Headers) {
		if (this.state !== EventBus.OPEN)
			throw new InvalidSocketStateError(
				EventBus.getStateName(this.state),
				EventBus.getStateName(EventBus.OPEN)
			);

		this.socket.send(
			EventBus.encodeMessage({
				type: 'publish',
				address: channel,
				headers: headers || {},
				body: message
			})
		);
	}

	send(channel: string, message: any, callback: Callback, headers?: Headers) {
		if (this.state !== EventBus.OPEN)
			throw new InvalidSocketStateError(
				EventBus.getStateName(this.state),
				EventBus.getStateName(EventBus.OPEN)
			);

		const replyAddress = EventBus.generateUUID();
		this.replyHandlers[replyAddress] = callback;

		const envelope: Message = {
			type: 'send',
			address: channel,
			headers: headers || {},
			body: message,
			replyAddress
		};

		this.socket.send(EventBus.encodeMessage(envelope));
	}

	close() {
		console.log('Eventbus will close now!');
		this.enableReconnect(false);
		this.socket.close();
		if (this.reconnectTimerId) clearTimeout(this.reconnectTimerId);
	}

	private static generateUUID() {
		let b: number;
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, a => {
			b = Math.random() * 16;
			return (a === 'y' ? (b & 3) | 8 : b | 0).toString(16);
		});
	}

	private static encodeMessage(message: Message): string {
		return JSON.stringify(message);
	}

	private static decodeMessage(data: string): Message {
		return JSON.parse(data) as Message;
	}

	private setupConnection(url: string, options?: SockJS.Options): WebSocket {
		const socket = new SockJS(url, null, options);

		socket.onopen = () => {
			this.enablePing(true);
			this.onOpen && this.onOpen();
			if (that.reconnectTimerId) {
				that.reconnectAttempts = 0;
				that.onReconnect && that.onReconnect();
				// re-subscribe to registered channels
				Object.keys(that.handlers).forEach(channel => {
					that.subscribeToChannel(channel);
				});
			}
		};

		socket.onclose = () => {
			this.enablePing(false);
			this.onClose && this.onClose();
			if (that.pingTimerId) clearInterval(that.pingTimerId);
			if (
				that.reconnectEnabled &&
				that.reconnectAttempts < that.options.reconnectAttempts
			) {
				that.reconnectTimerId = setTimeout(() => {
					that.socket = this.setupConnection(url, options);
				}, that.newReconnectDelay());

				++that.reconnectAttempts;
			}
		};

		const that = this;
		socket.onmessage = function (this: WebSocket, ev: MessageEvent) {
			const message = EventBus.decodeMessage(ev.data) as AddressableMessage;

			// define a reply function on the message itself
			if (message.replyAddress) {
				Object.defineProperty(message, 'reply', {
					value: function (
						message: any,
						callback: Callback,
						headers?: Headers
					) {
						return that.send(message.replyAddress, message, callback, headers);
					}
				});
			}

			const successMessage = message.type === 'err' ? null : message;
			const errorMessage = message.type === 'err' ? message : null;

			if (that.handlers[message.address]) {
				// iterate of all registered handlers
				that.handlers[message.address].forEach(handler => {
					handler(
						successMessage as SuccessMessage,
						errorMessage as ErrorMessage
					);
				});
			} else if (that.replyHandlers[message.address]) {
				that.replyHandlers[message.address](
					successMessage as SuccessMessage,
					errorMessage as ErrorMessage
				);
				// call reply handler only once
				delete that.replyHandlers[message.address];
			} else {
				if (errorMessage) {
					that.onError && that.onError(errorMessage as ErrorMessage);
				}
				console.warn('No handler found for message: ', successMessage);
			}
		};

		return socket;
	}

	private sendPing() {
		if (this.state === EventBus.OPEN) {
			this.socket.send(EventBus.encodeMessage({ type: 'ping' }));
		}
	}

	private newReconnectDelay() {
		let ms =
			this.options.delayMin *
			Math.pow(this.options.reconnectExponent, this.reconnectTimerId);
		if (this.options.randomizationFactor) {
			const rand = Math.random();
			const deviation = Math.floor(
				rand * this.options.randomizationFactor * ms
			);
			ms = (Math.floor(rand * 10) & 1) === 0 ? ms - deviation : ms + deviation;
		}
		return Math.min(ms, this.options.delayMax) | 0;
	}

	private subscribeToChannel(channel: string, headers?: Headers) {
		this.socket.send(
			EventBus.encodeMessage({
				type: 'register',
				address: channel,
				headers: headers || {}
			})
		);
	}

	private unsubscribeFromChannel(channel: string, headers?: Headers) {
		this.socket.send(
			EventBus.encodeMessage({
				type: 'unregister',
				address: channel,
				headers: headers || {}
			})
		);
	}
}
