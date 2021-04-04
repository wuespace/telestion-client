import {
	ChannelAddress,
	ErrorMessage,
	Headers,
	JsonSerializable,
	PingMessage,
	PublishMessage,
	RegisterMessage,
	SendMessage,
	UnregisterMessage
} from '@wuespace/telestion-client-types';

export function pingMessage(): PingMessage {
	return { type: 'ping' };
}

export function registerMessage(
	address: ChannelAddress,
	headers: Headers = {}
): RegisterMessage {
	return {
		type: 'register',
		address,
		headers
	};
}

export function unregisterMessage(
	address: ChannelAddress,
	headers: Headers = {}
): UnregisterMessage {
	return {
		type: 'unregister',
		address,
		headers
	};
}

export function publishMessage(
	address: ChannelAddress,
	content: JsonSerializable,
	headers: Headers = {}
): PublishMessage {
	return {
		type: 'publish',
		address,
		body: content,
		headers
	};
}

export function sendMessage(
	address: ChannelAddress,
	replyAddress: ChannelAddress,
	content: JsonSerializable,
	headers: Headers = {}
): SendMessage {
	return {
		type: 'send',
		address,
		replyAddress,
		body: content,
		headers
	};
}

export function errorMessage(
	failureCode: number,
	failureType: string,
	message: string
): ErrorMessage {
	return {
		type: 'err',
		failureCode,
		failureType,
		message
	};
}
