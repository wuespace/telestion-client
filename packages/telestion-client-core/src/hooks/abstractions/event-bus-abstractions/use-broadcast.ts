import { useCallback } from 'react';
import { StateSelector } from 'zustand';
import {
	ChannelAddress,
	JsonSerializable
} from '@wuespace/telestion-client-types';

import { EventBusState, useEventBus } from '../../stores';

const eventBusSelector: StateSelector<
	EventBusState,
	EventBusState['eventBus']
> = state => state.eventBus;

/**
 * Broadcasts a message to the event bus.
 */
type BroadcastFunction =
	/**
	 * @param message - the message that will be broadcast
	 */
	(message: JsonSerializable) => void;

/**
 * Sends a broadcast on the specified address with the returned function.
 * @param address - the channel with the address to broadcast to
 * @returns a function that broadcasts a message
 *
 * @throws TypeError - if there is no eventbus instance
 *
 * @see {@link useEventBus}
 * @see {@link EventBus.publish}
 *
 * @example
 * ```ts
 * const broadcast = useBroadcast('address:hello-world');
 *
 * const handleClick = () => {
 *   broadcast('Hello World');
 * };
 *
 * return <button onClick={handleClick}>Broadcast a hello world</button>;
 * ```
 */
export function useBroadcast(address: ChannelAddress): BroadcastFunction {
	const eventBus = useEventBus(eventBusSelector);

	if (!eventBus) {
		throw new TypeError(
			'There is no eventbus instance to broadcast to. ' +
				'Please check if the eventbus was created and try again.'
		);
	}

	return useCallback(
		message => {
			eventBus.publish(address, message);
		},
		[eventBus, address]
	);
}
