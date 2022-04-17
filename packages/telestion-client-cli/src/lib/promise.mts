/**
 * Accepts a list of promises and minimal duration.
 * If the provided promises resolve or reject faster than the minimal duration,
 * the returned promise lasts the minimal duration.
 *
 * @param minDuration - the minimal duration in milliseconds
 * @param promises - the list of promises
 * @return a new promise that resolves with an array containing the results of the other promises
 * @see Promise.allSettled
 */
export async function lastAtLeast(
	minDuration: number,
	...promises: PromiseLike<unknown>[]
): Promise<PromiseSettledResult<unknown>[]> {
	const waitPromise = new Promise<void>(resolve =>
		setTimeout(resolve, minDuration)
	);
	return (await Promise.allSettled([...promises, waitPromise])).slice(0, -1);
}
