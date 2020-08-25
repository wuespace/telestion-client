import { useEffect } from 'react';

import { Channel } from '../../model/Channels';
import useEventBus from './useEventBus';

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
	(data: unknown, error?: Error | null) => void
): void {
	const eventBus = useEventBus();

	useEffect(() => {
		const cb = (error: Error, message: any) => {
			onUpdate(message.body, error);
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
