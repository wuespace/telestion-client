import { useEffect } from 'react';

import { Channel } from '../../model/Channels';
import useEventBus from './useEventBus';
import { Callback, ErrorMessage } from '../../model/VertxEventBus';
import JSONSerializable from '../../model/JSONSerializable';

/**
 * Subscribes to the eventbus via a specific channel.
 * @param channel the channel address
 * @param onUpdate callback that gets called on new data
 */
export default function useChannel(
	channel: Channel,
	onUpdate: /**
	 * @param data new data from the eventbus
	 * @param error error if something went wrong or null
	 */
	(data: JSONSerializable | null, error: ErrorMessage | null) => void
): void {
	const eventBus = useEventBus();

	useEffect(() => {
		const cb: Callback = (message, error) => {
			onUpdate(message ? message.body : null, error);
		};

		try {
			eventBus.registerHandler(channel, cb);
		} catch (err) {
			console.error('Error during register of handler in eventbus', err);
		}
		return () => {
			try {
				eventBus.unregisterHandler(channel, cb);
			} catch (err) {
				console.error('Error during unregister of handler in eventbus', err);
			}
		};
	}, [channel, eventBus, onUpdate]);
}
