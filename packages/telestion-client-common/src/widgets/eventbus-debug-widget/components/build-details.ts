import { ConnectionState, EventBus } from '@wuespace/vertx-event-bus';

const connectionStateMap: { [key in ConnectionState]: string } = {
	0: 'CONNECTING',
	1: 'OPEN',
	2: 'CLOSING',
	3: 'CLOSED'
};

/**
 * A detail definition for a detail table.
 * It contains a name and a associated value.
 */
export interface Detail {
	name: string;
	value: string | number | JSX.Element;
}

/**
 * Builds the detail definitions for the detail table
 * based on the current event bus state.
 *
 * @param eventBus - the current eventbus instance
 * @param error - optional error message
 * if something gone wrong on connection setup or teardown
 *
 * @example
 * ```tsx
 * const details = buildDetails(eventBus, error);
 *
 * <tbody>
 * 	{details.map((detail, index) => (
 * 		<tr key={index}>
 * 			<td>{detail.name}</td>
 * 			<td>{detail.value}</td>
 * 		</tr>
 * 	))}
 * </tbody>
 * ```
 */
// eslint-disable-next-line max-lines-per-function
export function buildDetails(
	eventBus: EventBus,
	error: string | null
): Detail[] {
	return [
		{
			name: 'Current state',
			value: connectionStateMap[eventBus.state]
		},
		{
			name: 'Connection URL',
			value: eventBus.url
		},
		{
			name: 'Automatic Reconnect',
			value: eventBus.autoReconnect ? 'enabled' : 'disabled'
		},
		{
			name: 'Reconnect attempts',
			value: eventBus.reconnectAttempts
		},
		{
			name: 'Received messages',
			value: eventBus.receivedMessages
		},
		{
			name: 'Sent messages',
			value: eventBus.sentMessages
		},
		{
			name: 'Error',
			value: error || 'none'
		},
		{
			name: 'Minimal reconnect delay',
			value: `${eventBus.options.delayMin} ms`
		},
		{
			name: 'Maximal reconnect delay',
			value: `${eventBus.options.delayMax} ms`
		},
		{
			name: 'Ping Interval',
			value: `${eventBus.options.pingInterval} ms`
		},
		{
			name: 'Randomization factor',
			value: eventBus.options.randomizationFactor
		},
		{
			name: 'Reconnect exponent',
			value: eventBus.options.reconnectExponent
		}
	];
}
