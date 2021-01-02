import { useCallback, useState } from 'react';

import { useChannel } from './use-channel';
import { JsonSerializable } from '../../lib/vertx-event-bus';

/**
 * Gets the latest information broadcast on a specific channel.
 * @param channel the channel address
 *
 * @typeParam C union of all possible channels (defaults to `string`)
 *
 * @throws if there is no eventbus instance
 *
 * @example```ts
 * const latestPos = useChannelLatest('channel:position');
 * return <p>Latest position: {latestPos}</p>;
 * ```
 */
export function useChannelLatest<C extends string = string>(channel: C) {
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
