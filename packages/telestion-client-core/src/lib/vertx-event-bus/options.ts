/**
 * the default options for the event bus
 */
export interface Options {
	/**
	 * time between ping messages sent to the backend server in milliseconds
	 */
	pingInterval?: number;
	/**
	 * number of attempts to try to reconnect to the backend server
	 * before no more reconnects get attempted
	 */
	reconnectAttempts?: number;
	/**
	 * exponent of the power function used to determine a new reconnect delay
	 * based on reconnect attempts
	 *
	 * for implementation details, see {@link EventBus.newReconnectDelay}
	 */
	reconnectExponent?: number;
	/**
	 * minimum time to wait between reconnect attempts in milliseconds
	 */
	delayMin?: number;
	/**
	 * maximum time to wait between reconnect attempts in milliseconds
	 */
	delayMax?: number;
	/**
	 * randomization factor for the deviation
	 * used in the reconnect delay generator function
	 *
	 * for implementation details, see {@link EventBus.newReconnectDelay}
	 */
	randomizationFactor?: number;
}
