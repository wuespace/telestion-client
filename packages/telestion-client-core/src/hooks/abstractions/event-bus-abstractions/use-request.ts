import { useCallback } from 'react';
import { StateSelector } from 'zustand';
import {
	Callback,
	ChannelAddress,
	JsonSerializable
} from '@wuespace/telestion-client-types';

import { EventBusState, useEventBus } from '../../stores';
import { SendFunction } from './use-request.model';

const eventBusSelector: StateSelector<
	EventBusState,
	EventBusState['eventBus']
> = state => state.eventBus;

/**
 * Sends a message on the specified address
 * and get the first reply via a callback.
 *
 * @param address - the channel with the address to send the message to
 * @returns a function that sends a message and registers a one-time callback
 *
 * @typeParam T - the type of the received data in the callback
 * (defaults to JSON serializable data)
 *
 * @throws TypeError - if there is no eventbus instance
 *
 * @see {@link useEventBus}
 * @see {@link EventBus.send}
 *
 * @example
 * ```ts
 * const [answer, setAnswer] = useState<JSONSerializable>();
 * const send = useRequest('address:send-my-anything');
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
export function useRequest<T extends JsonSerializable = JsonSerializable>(
	address: ChannelAddress
): SendFunction<T> {
	const eventBus = useEventBus(eventBusSelector);

	if (!eventBus) {
		throw new TypeError(
			'There is no eventbus instance to send and receive to. ' +
				'Please check if the eventbus was created and try again.'
		);
	}

	return useCallback(
		(sendMessage, callback) => {
			const cb: Callback = (recMessage, error) => {
				callback(recMessage ? (recMessage.body as T) : null, error);
			};
			eventBus.send(address, sendMessage, cb);
		},
		[eventBus, address]
	);
}
