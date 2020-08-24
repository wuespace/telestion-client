import { Channel } from '../../model/Channels';
import useChannel from './useChannel';
import { useCallback, useState } from 'react';

/**
 * Gets the latest information broadcast on a specific channel.
 * @param channel the channel address
 *
 * @example
 * const latestPos = useChannelLatest('positionChannel');
 * return <p>Latest position: {latestPos}</p>;
 */
export default function useChannelLatest(channel: Channel): any {
	const [state, setState] = useState<any>();
	const cb = useCallback(message => {
		setState(message);
	}, []);

	useChannel(channel, cb);
	return state;
}
