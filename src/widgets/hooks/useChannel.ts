import { useEffect } from 'react';

import { Channel } from '../../model/vertxEventBus/Channels';
import {
	Callback,
	ErrorMessage
} from '../../model/vertxEventBus/VertxEventBus';
import JSONSerializable from '../../model/vertxEventBus/JSONSerializable';

import useLogger from '../../hooks/useLogger';
import useEventBus from './useEventBus';

/**
 * Subscribes to the eventbus via a specific channel.
 * @param channel the channel address
 * @param onUpdate callback that gets called on new data
 *
 * @see {@link EventBus}
 *
 * @example ```ts
 * const [state, setState] = useState<JSONSerializable>();
 *
 * const cb = useCallback((data) => {
 *   setState(data);
 * }, []);
 *
 * useChannel('SOME_CHANNEL', cb);
 *
 * return <p>Content: {state}</p>;
 * ```
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
	const logger = useLogger('useChannel');

	useEffect(() => {
		const cb: Callback = (message, error) => {
			onUpdate(message ? message.body : null, error);
		};

		try {
			eventBus.registerHandler(channel, cb);
		} catch (err) {
			logger.error('Error during register of handler in eventbus', err);
		}
		return () => {
			try {
				eventBus.unregisterHandler(channel, cb);
			} catch (err) {
				logger.error('Error during unregister of handler in eventbus', err);
			}
		};
	}, [channel, eventBus, logger, onUpdate]);
}
