import { useEffect } from 'react';
import { StateSelector } from 'zustand';

import { EventBusState, useEventBus } from '../use-event-bus';
import {
	Callback,
	ErrorMessage,
	JsonSerializable
} from '../../lib/vertx-event-bus';

const eventBusSelector: StateSelector<
	EventBusState,
	EventBusState['eventBus']
> = state => state.eventBus;

/**
 * Subscribes to the eventbus via a specific channel.
 *
 * **Important note:**
 *
 * Please preserve identity of the `onUpdate` function
 * to minimize registers and unregisters on the eventbus.
 *
 * For example use {@link useCallback} from React,
 * or if you only interested on the most recent data
 * use {@link useChannelLatest} instead.
 * It handles the caveats for you.
 *
 * @param channel the channel address
 * @param onUpdate callback that gets called on new data
 *
 * @typeParam C union of all possible channels (defaults to `string`)
 *
 * @throws if there is no eventbus instance
 *
 * @see {@link useChannelLatest}
 * @see {@link EventBus}
 *
 * @example ```ts
 * const [state, setState] = useState<JSONSerializable>();
 *
 * const cb = useCallback((data) => {
 *   setState(data);
 * }, []);
 *
 * useChannel('channel:test-data', cb);
 *
 * return <p>Content: {state}</p>;
 * ```
 */
export function useChannel<C extends string = string>(
	channel: C,
	onUpdate: /**
	 * @param data new data from the eventbus
	 * @param error error if something went wrong or `null`
	 */
	(data: JsonSerializable | null, error: ErrorMessage | null) => void
): void {
	const eventBus = useEventBus(eventBusSelector);

	if (!eventBus) {
		throw new Error(
			'There is no eventbus instance to subscribe to. ' +
				'Please check if the eventbus was created and try again.'
		);
	}

	useEffect(() => {
		const cb: Callback = (message, error) => {
			onUpdate(message ? message.body : null, error);
		};

		eventBus.registerHandler(channel, cb);
		// clean up callback
		return () => eventBus.unregisterHandler(channel, cb);
	}, [eventBus, channel, onUpdate]);
}
