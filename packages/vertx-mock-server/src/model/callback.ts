import { JsonSerializable } from '@wuespace/telestion-client-types';

/**
 * The arguments of a base callback which gets called
 * when the Vert.x mock server receives a message from a client.
 */
interface BaseCallbackArgs {
	/**
	 * The received message.
	 */
	message: JsonSerializable;
	/**
	 * The type of the received message.
	 */
	type: 'send' | 'publish';
}

/**
 * The arguments of a send callback which gets called
 * when the Vert.x mock server receives
 * a {@link @wuespace/telestion-client-types#SendMessage}.
 */
export interface SendCallbackArgs extends BaseCallbackArgs {
	type: 'send';
	/**
	 * A callback to respond to the sent message.
	 * @param response - the response message to send back
	 */
	respond: (response: JsonSerializable) => void;
}

/**
 * The arguments of a publish callback which gets called
 * when the Vert.x mock server receives
 * a {@link @wuespace/telestion-client-types#PublishMessage}.
 */
export interface PublishCallbackArgs extends BaseCallbackArgs {
	type: 'publish';
}

/**
 * The arguments of a callback which gets called
 * when the Vert.x mock server receives
 * a {@link @wuespace/telestion-client-types#SendMessage}
 * or a {@link @wuespace/telestion-client-types#PublishMessage}
 * from a client.
 */
export type CallbackArgs = SendCallbackArgs | PublishCallbackArgs;

/**
 * The callback which gets called
 * when the Vert.x mock server receives
 * a {@link @wuespace/telestion-client-types#SendMessage}
 * or a {@link @wuespace/telestion-client-types#PublishMessage}
 * from a client.
 */
export type Callback = (args: CallbackArgs) => void;

/**
 * The id of a registered callback.
 *
 * It can be registered with {@link MockServer.register}
 * and unregistered with this value in {@link MockServer.unregister}.
 */
export type CallbackId = number;
