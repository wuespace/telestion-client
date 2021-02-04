import { useEffect } from 'react';
import { StateSelector } from 'zustand';
import {
	Callback,
	ChannelAddress,
	ErrorMessage,
	JsonSerializable
} from '@wuespace/telestion-client-types';

import { EventBusState, useEventBus } from '../../stores';

const eventBusSelector: StateSelector<
	EventBusState,
	EventBusState['eventBus']
> = state => state.eventBus;

/**
 * Subscribes to an event bus channel specified by an address.
 *
 * **Important note:**
 *
 * Please preserve the identity of the `onUpdate` function
 * to minimize registers and unregisters on the eventbus.
 *
 * For example use {@link useCallback} from React,
 * or if you only interested on the most recent data
 * use {@link useChannelLatest} instead.
 * It handles the caveats for you.
 *
 * @param address - the channel with the address to receive data from
 * @param onUpdate - callback that gets called on new received data
 *
 * @typeParam T - the type of the received data
 * (defaults to JSON serializable data)
 *
 * @throws TypeError - if there is no eventbus instance
 *
 * @see {@link useEventBus}
 * @see {@link useChannelLatest}
 * @see {@link EventBus}
 *
 * @example
 * ```ts
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
export function useChannel<T extends JsonSerializable = JsonSerializable>(
	address: ChannelAddress,
	onUpdate: /**
	 * @param data - new data from the eventbus
	 * @param error - error if something went wrong or `null`
	 */
	(data: T | null, error: ErrorMessage | null) => void
): void {
	const eventBus = useEventBus(eventBusSelector);

	if (!eventBus) {
		throw new TypeError(
			'There is no eventbus instance to subscribe to. ' +
				'Please check if the eventbus was created and try again.'
		);
	}

	useEffect(() => {
		const cb: Callback = (message, error) => {
			onUpdate(message ? (message.body as T | null) : null, error);
		};

		eventBus.registerHandler(address, cb);
		// clean up callback
		return () => eventBus.unregisterHandler(address, cb);
	}, [eventBus, address, onUpdate]);
}
