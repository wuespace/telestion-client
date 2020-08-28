/**
 * A react hook that enables broadcast functionality via the event bus.
 * @packageDocumentation
 *
 * @category Widget Hook
 */
import { useCallback } from 'react';

import { Channel } from '../../model/Channels';
import JSONSerializable from '../../model/JSONSerializable';

import useEventBus from './useEventBus';

/**
 * Send a broadcast on the specified channel with the returned function.
 * @param channel channel to broadcast to
 * @returns a function that broadcast a message
 *
 * @see {@link EventBus.publish}
 *
 * @example ```ts
 * const broadcast = useBroadcast('channel:hello-world');
 *
 * const handleClick = () => {
 *   broadcast('Hello World');
 * };
 *
 * return <button onClick={handleClick}>Broadcast a hello world</button>;
 * ```
 */
export default function useBroadcast(channel: Channel) {
	const eventBus = useEventBus();

	return useCallback((message: JSONSerializable) => {
		eventBus.publish(channel, message);
	}, [channel, eventBus]);
}
