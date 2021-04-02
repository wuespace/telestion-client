import { randInt } from './rand-int';

/**
 * Generates a random string with a defined length.
 * @param length - the length of the random string
 *
 * @example
 * ```ts
 * console.log(randomString(6)); // dfFz61
 * console.log(randomString(6)); // 8dP93d
 * console.log(randomString(6)); // PDT5wz
 * ```
 */
export function randomString(length: number): string {
	let res = '';
	const chars =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < length; i++) {
		res += chars[randInt(0, chars.length - 1)];
	}
	return res;
}
