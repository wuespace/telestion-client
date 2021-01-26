import { useCallback, useState } from 'react';
import { JsonSerializable } from '@wuespace/vertx-event-bus';
import { useChannel } from './use-channel';

/**
 * Gets the latest information broadcast on a specific channel.
 * @param channel - the channel address
 * @returns the last received message
 * or `undefined` if no message was received yet
 *
 * @typeParam C - union of all possible channels (defaults to `string`)
 *
 * @throws if there is no eventbus instance
 *
 * @see {@link useChannel}
 * @see {@link useEventBus}
 *
 * @example
 * ```ts
 * const latestPos = useChannelLatest('channel:position');
 * return <p>Latest position: {latestPos}</p>;
 * ```
 */
export function useChannelLatest<C extends string = string>(
	channel: C
): JsonSerializable | undefined {
	const [latest, setLatest] = useState<JsonSerializable>();

	// useCallback here to preserve identity of callback function
	const handleUpdate = useCallback((data: JsonSerializable | null) => {
		if (data) {
			setLatest(data);
		}
	}, []);

	useChannel<C>(channel, handleUpdate);
	return latest;
}
