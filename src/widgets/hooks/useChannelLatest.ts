import { useCallback, useState } from 'react';

import { Channel } from '../../model/Channels';
import JSONSerializable from '../../model/JSONSerializable';

import useChannel from './useChannel';

/**
 * Gets the latest information broadcast on a specific channel.
 * @param channel the channel address
 *
 * @example
 * const latestPos = useChannelLatest('positionChannel');
 * return <p>Latest position: {latestPos}</p>;
 */
export default function useChannelLatest(channel: Channel): any {
	const [state, setState] = useState<JSONSerializable>();
	const cb = useCallback((data: JSONSerializable | null) => {
		if (data) setState(data);
	}, []);

	useChannel(channel, cb);
	return state;
}
