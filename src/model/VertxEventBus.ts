import JSONSerializable from './JSONSerializable';

export interface Options {
	pingInterval: number;
	reconnectAttempts: number;
	reconnectExponent: number;
	delayMin: number;
	delayMax: number;
	randomizationFactor: number;
}

export interface Headers {
	[key: string]: any;
}

export interface BaseMessage {
	type: string;
}

export interface PingMessage extends BaseMessage {
	type: 'ping';
}

export interface AddressableMessage extends BaseMessage {
	address: string;
	headers: Headers;
	replyAddress?: string;
	reply?: (message: any, callback: Callback, headers?: Headers) => void;
}

export interface SuccessMessage extends AddressableMessage {
	type: string;
	body: JSONSerializable;
}

export interface ErrorMessage extends AddressableMessage {
	type: 'err';
	failureCode: number;
	failureType: string;
	message: string;
}

export type Message =
	| PingMessage
	| AddressableMessage
	| SuccessMessage
	| ErrorMessage;

export type Callback = (
	message: SuccessMessage | null,
	error: ErrorMessage | null
) => void;
