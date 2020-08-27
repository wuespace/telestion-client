import { useCallback } from 'react';

import { Channel } from '../../model/Channels';
import JSONSerializable from '../../model/JSONSerializable';
import { Callback } from '../../model/VertxEventBus';

import useEventBus from './useEventBus';

export default function useRequest(channel: Channel) {
	const eventBus = useEventBus();
	return useCallback((message: JSONSerializable, callback: Callback) => {
		eventBus.send(channel, message, callback);
	}, [channel, eventBus]);
}
