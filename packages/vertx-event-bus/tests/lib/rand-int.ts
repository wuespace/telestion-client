/**
 * Returns a random integer between `min` and `max` values.
 * @param min - the lower bound
 * @param max - the upper bound
 *
 * @example
 * ```ts
 * const random = randInt(1, 10); // 3
 * const random = randInt(1, 10); // 8
 * const random = randInt(1, 10); // 2
 * ```
 */
export function randInt(min: number, max: number): number {
	const minInt = Math.ceil(min);
	const maxInt = Math.floor(max);
	return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
}
