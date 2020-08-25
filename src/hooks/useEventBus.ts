import { EventBus } from 'vertx3-eventbus-client';
import useConnection from './useConnection';

export default function useEventBus(): EventBus {
	const [{ eventBus }] = useConnection();

	if (!eventBus) throw new Error('EventBus is not active');
	return eventBus;
}
