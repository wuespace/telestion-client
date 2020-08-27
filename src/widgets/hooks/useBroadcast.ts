import { useCallback } from 'react';

import { Channel } from '../../model/Channels';
import JSONSerializable from '../../model/JSONSerializable';

import useEventBus from './useEventBus';

export default function useBroadcast(channel: Channel) {
	const eventBus = useEventBus();

	return useCallback((message: JSONSerializable) => {
		eventBus.publish(channel, message);
	}, [channel, eventBus]);
}
