import { PingMessage } from './ping-message';
import { RegisterMessage } from './register-message';
import { UnregisterMessage } from './unregister-message';
import { PublishMessage } from './publish-message';
import { SendMessage } from './send-message';
import { ReceiveMessage } from './receive-message';
import { ErrorMessage } from './error-message';

/**
 * a message sent to and received from the event bus
 */
export type Message =
	| PingMessage
	| RegisterMessage
	| UnregisterMessage
	| PublishMessage
	| SendMessage
	| ReceiveMessage
	| ErrorMessage;
