import { useCallback } from 'react';
import { StateSelector } from 'zustand';
import { JsonSerializable } from '@wuespace/vertx-event-bus';

import { EventBusState, useEventBus } from '../use-event-bus';

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
 * Send a broadcast on the specified channel with the returned function.
 * @param channel - channel to broadcast to
 * @returns a function that broadcasts a message
 *
 * @typeParam C - union of all possible channels (defaults to `string`)
 *
 * @throws if there is no eventbus instance
 *
 * @see {@link useEventBus}
 * @see {@link EventBus.publish}
 *
 * @example
 * ```ts
 * const broadcast = useBroadcast('channel:hello-world');
 *
 * const handleClick = () => {
 *   broadcast('Hello World');
 * };
 *
 * return <button onClick={handleClick}>Broadcast a hello world</button>;
 * ```
 */
export function useBroadcast<C extends string = string>(
	channel: C
): BroadcastFunction {
	const eventBus = useEventBus(eventBusSelector);

	if (!eventBus) {
		throw new Error(
			'There is no eventbus instance to broadcast to. ' +
				'Please check if the eventbus was created and try again.'
		);
	}

	return useCallback(
		message => {
			eventBus.publish(channel, message);
		},
		[eventBus, channel]
	);
}
