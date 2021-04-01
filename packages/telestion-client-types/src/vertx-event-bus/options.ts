/**
 * the default options for the event bus
 */
export interface Options {
	/**
	 * When `true`, the event bus tries to reconnect automatically
	 * if the connection with the backend is lost.
	 *
	 * Defaults to `true`.
	 */
	autoReconnect: boolean;

	/**
	 * Time between ping messages sent to the backend server in milliseconds.
	 *
	 * Defaults to `5000` ms.
	 */
	pingInterval: number;

	/**
	 * Number of attempts to try to reconnect to the backend server
	 * before no more reconnects get attempted.
	 *
	 * Defaults to `Infinity`.
	 */
	reconnectAttempts: number;

	/**
	 * Exponent of the power function used to determine a new reconnect delay
	 * based on reconnect attempts.
	 *
	 * For implementation details,
	 * see {@link @wuespace/vertx-event-bus#EventBus.newReconnectDelay}.
	 *
	 * Defaults to `2`.
	 */
	reconnectExponent: number;

	/**
	 * Minimum time to wait between reconnect attempts in milliseconds.
	 *
	 * Defaults to `1000` ms.
	 */
	delayMin: number;

	/**
	 * Maximum time to wait between reconnect attempts in milliseconds.
	 *
	 * Defaults to `5000` ms.
	 */
	delayMax: number;

	/**
	 * Randomization factor for the deviation
	 * used in the reconnect delay generator function.
	 *
	 * For implementation details,
	 * see {@link @wuespace/vertx-event-bus#EventBus.newReconnectDelay}.
	 *
	 * Defaults to `0.5`.
	 */
	randomizationFactor: number;
}
