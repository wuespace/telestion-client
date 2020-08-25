import { EventBus } from 'vertx3-eventbus-client';
import useConnection from '../../hooks/useConnection';

/**
 * Gets the eventbus from the connection status.
 * Use only in widgets
 * @returns a eventbus instance
 *
 * @see EventBus
 * @see Channel
 *
 * @example ```
 * const eventBus = useEventBus();
 * const [position, setPosition] = useState<any>();
 *
 * useEffect(() => {
 *   const cb = (error, message) => {
 *     setPosition(message.body);
 *   };
 *   // register new event handler
 *   eventBus.registerHandler(MOCK_POSITION, cb);
 *   // cleanup event handler on eventBus change or unmount
 *   return () => {
 *   	 eventBus.unregisterHandler(MOCK_POSITION, cb);
 *   };
 * }, [eventBus]);
 *
 * return <p>Current position: {position}</p>;
 * ```
 */
export default function useEventBus(): EventBus {
	const [{ eventBus }] = useConnection();

	if (!eventBus)
		throw new Error(
			'EventBus is not active (this implies an incorrect usage outside of widgets)'
		);
	return eventBus;
}
