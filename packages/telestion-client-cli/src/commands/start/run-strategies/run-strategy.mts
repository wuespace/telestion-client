/**
 * A strategy for running a specific target (e.g. browser, electron) in the
 * `tc-cli start` command.
 */
export interface RunStrategy {
	/**
	 * Runs the strategy.
	 */
	run(): Promise<void>;

	/**
	 * Stops the strategy.
	 * @param signal - the signal that caused the stop
	 */
	stop(signal?: NodeJS.Signals): Promise<void>;
}
