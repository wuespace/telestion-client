/**
 * A react hook that enables send and reply functionality via the event bus.
 * @packageDocumentation
 *
 * @category Widget Hook
 */
import { useCallback } from 'react';

import { Channel } from '../../model/vertxEventBus/Channels';
import JSONSerializable from '../../model/vertxEventBus/JSONSerializable';
import {
	Callback,
	ErrorMessage
} from '../../model/vertxEventBus/VertxEventBus';

import useEventBus from './useEventBus';

/**
 * Send a message to the event bus and get the first reply via a callback.
 */
type SendFunction = (
	message: JSONSerializable,
	callback: (
		message: JSONSerializable | null,
		error: ErrorMessage | null
	) => void
) => void;

/**
 * Send a message on the specified channel
 * and get the first reply via a callback.
 * @param channel the channel to send to
 * @returns a function that sends a message and registers a one-time callback
 *
 * @see {@link EventBus.send}
 *
 * @example ```ts
 * const [answer, setAnswer] = useState<JSONSerializable>();
 * const send = useRequest('channel:send-my-anything');
 *
 * const handleClick = () => {
 *   send('Ping', (message: JSONSerializable) => {
 *     if (message) setAnswer(message);
 *   });
 * };
 *
 * return (
 *   <>
 *     <button onClick={handleClick}>Send message</button>
 *     <p>{answer}</p>
 *   </>
 * );
 * ```
 */
export default function useRequest(channel: Channel): SendFunction {
	const eventBus = useEventBus();
	return useCallback(
		(
			message: JSONSerializable,
			callback: (
				message: JSONSerializable | null,
				error: ErrorMessage | null
			) => void
		) => {
			const cb: Callback = (message, error) => {
				callback(message ? message.body : null, error);
			};
			eventBus.send(channel, message, cb);
		},
		[channel, eventBus]
	);
}
