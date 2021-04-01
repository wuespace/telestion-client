import SockJS from 'sockjs-client';
import {
	Message,
	Options,
	PingMessage
} from '@wuespace/telestion-client-types';

import { defaultOptions } from './default-options';
import { validate } from './lib/validator';

// performance improvement
const pingMessage: PingMessage = { type: 'ping' };
const rawPing = JSON.stringify(pingMessage);

export class BasicEventBus {
	private readonly options: Options;

	private pending: Array<string> = [];

	private socket: SockJS;

	private pingTimer: any = null;

	private reconnectTimer: any = null;

	readonly url: string;

	reconnectAttempts = 0;

	sentMessages = 0;

	receivedMessages = 0;

	get autoReconnect(): boolean {
		return this.options.autoReconnect;
	}

	set autoReconnect(newState: boolean) {
		this.options.autoReconnect = newState;
		// clean up reconnect on `false`
		if (!newState && this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
		}
	}

	onOpen?(): void;

	onMessage?(message: Message): void;

	onClose?(): void;

	onReconnect?(): void;

	constructor(url: string, options: Partial<Options>) {
		this.options = { ...defaultOptions, ...options };
		this.url = url;
		this.socket = this.newSocket();
	}

	send(message: Message, store = true): void {
		// encode message
		const data = JSON.stringify(message);

		try {
			this.sendRaw(data);
		} catch (err) {
			// The socket function throws when the event bus is closed
			// so we can store the encoded message for a later try.
			if (store) this.pending.push(data);
		}
	}

	close(): void {
		// stop auto reconnect feature
		this.autoReconnect = false;
		this.socket.close();
	}

	private newSocket(): SockJS {
		const socket = new SockJS(this.url);

		socket.onopen = () => this.handleOpen();
		socket.onclose = () => this.handleClose();
		socket.onmessage = event => this.handleMessage(event);

		return socket;
	}

	private handleOpen(): void {
		this.pingTimer = setInterval(
			() => this.sendRaw(rawPing),
			this.options.pingInterval
		);
		// inform upper layer
		this.onOpen?.();
		if (this.reconnectTimer) this.onReconnect?.();

		// send pending messages
		this.pending = this.pending.filter(data => {
			try {
				this.sendRaw(data);
				// message is sent -> delete from pending list
				return false;
			} catch (err) {
				// message cannot be sent -> keep in pending list
				return true;
			}
		});
	}

	private handleClose(): void {
		clearInterval(this.pingTimer);
		// inform upper layer
		this.onClose?.();

		// handle reconnect
		if (
			this.options.autoReconnect &&
			this.reconnectAttempts < this.options.reconnectAttempts
		) {
			this.reconnectTimer = setTimeout(() => {
				// after timeout, create new socket which handles the next reconnect
				this.socket = this.newSocket();
			}, this.newReconnectDelay());
		}
	}

	private handleMessage(event: MessageEvent): void {
		this.receivedMessages++;
		try {
			// decode message
			const message: Message = JSON.parse(event.data);
			// validate
			if (!validate(message)) {
				throw new SyntaxError(validate.errors?.[0].message);
			}
			this.onMessage?.(message);
		} catch (err) {
			this.onMessage?.({
				type: 'err',
				failureCode: 23478934,
				failureType: err.name,
				message: `${err.message} - Cannot decode '${event.data}'`
			});
		}
	}

	private sendRaw(data: string): void {
		this.socket.send(data);
		this.sentMessages++;
	}

	private newReconnectDelay(): number {
		// It multiplies the minimal delay with a power function
		// that has as base the current reconnect attempts
		// and as exponent the in the options defined exponent
		// to determine a new delay time.
		// Then a random number between 0 and 1 is generated
		// which is multiplied to the randomization factor
		// that describes the deviation from calculated delay time.
		// Now the deviation is added or subtracted to calculated delay time
		// based on the random factor.
		// Finally the minimum of the delay time
		// and the maximum delay time is returned.
		let ms =
			this.options.delayMin *
			this.options.reconnectExponent ** this.reconnectAttempts;
		if (this.options.randomizationFactor) {
			const rand = Math.random();
			const deviation = Math.floor(
				rand * this.options.randomizationFactor * ms
			);
			// eslint-disable-next-line no-bitwise
			ms = (Math.floor(rand * 10) & 1) === 0 ? ms - deviation : ms + deviation;
		}
		// eslint-disable-next-line no-bitwise
		return Math.min(ms, this.options.delayMax) | 0;
	}
}
