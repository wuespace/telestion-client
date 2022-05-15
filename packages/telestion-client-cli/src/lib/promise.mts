/**
 * Returns a promise that waits the specified duration before it resolves.
 * @param duration - the duration to wait in milliseconds
 */
export async function wait(duration: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, duration));
}

/**
 * Accepts a list of promises and minimal duration.
 * If the provided promises resolve or reject faster than the minimal duration,
 * the returned promise lasts the minimal duration.
 *
 * @param minDuration - the minimal duration in milliseconds
 * @param promise - the promise to run
 * @return a new promise that resolves with the result from the passed promise
 * @see Promise.all
 */
export async function lastAtLeast<T>(
	minDuration: number,
	promise: PromiseLike<T>
): Promise<T> {
	return (await Promise.all([promise, wait(minDuration)]))[0];
}
