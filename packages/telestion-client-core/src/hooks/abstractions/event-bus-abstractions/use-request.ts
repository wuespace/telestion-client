import { useCallback } from 'react';
import { StateSelector } from 'zustand';
import { Callback } from '@wuespace/vertx-event-bus';

import { EventBusState, useEventBus } from '../../stores';
import { SendFunction } from './use-request.model';

const eventBusSelector: StateSelector<
	EventBusState,
	EventBusState['eventBus']
> = state => state.eventBus;

/**
 * Send a message on the specified channel
 * and get the first reply via a callback.
 * @param channel - the channel to send to
 * @returns a function that sends a message and registers a one-time callback
 *
 * @typeParam C - union of all possible channels (defaults to `string`)
 *
 * @throws if there is no eventbus instance
 *
 * @see {@link useEventBus}
 * @see {@link EventBus.send}
 *
 * @example
 * ```ts
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
export function useRequest<C extends string = string>(
	channel: C
): SendFunction {
	const eventBus = useEventBus(eventBusSelector);

	if (!eventBus) {
		throw new Error(
			'There is no eventbus instance to send and receive to. ' +
				'Please check if the eventbus was created and try again.'
		);
	}

	return useCallback(
		(sendMessage, callback) => {
			const cb: Callback = (recMessage, error) => {
				callback(recMessage ? recMessage.body : null, error);
			};
			eventBus.send(channel, sendMessage, cb);
		},
		[eventBus, channel]
	);
}
