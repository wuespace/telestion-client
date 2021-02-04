import { useCallback, useState } from 'react';
import {
	ChannelAddress,
	JsonSerializable
} from '@wuespace/telestion-client-types';
import { useChannel } from './use-channel';

/**
 * Gets the latest information broadcast from a channel specified by an address.
 * @param address - the channel with the address to receive data from
 * @returns the last received message
 * or `undefined` if no message was received yet
 *
 * @typeParam T - the type of the received data
 * (defaults to JSON serializable data)
 *
 * @throws if there is no eventbus instance
 *
 * @see {@link useChannel}
 * @see {@link useEventBus}
 *
 * @example
 * ```ts
 * const latestPos = useChannelLatest('address:position');
 * return <p>Latest position: {latestPos}</p>;
 * ```
 */
export function useChannelLatest<T extends JsonSerializable = JsonSerializable>(
	address: ChannelAddress
): T | undefined {
	const [latest, setLatest] = useState<T>();

	// useCallback here to preserve identity of callback function
	const handleUpdate = useCallback((data: T | null) => {
		if (data) {
			setLatest(data);
		}
	}, []);

	useChannel<T>(address, handleUpdate);
	return latest;
}
