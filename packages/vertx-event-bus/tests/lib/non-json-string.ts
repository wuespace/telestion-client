import { randomString } from './random-string';

/**
 * Generates a random string which is **not** JSON parsable.
 *
 * @example
 * ```ts
 * console.log(nonJsonString()); // Djfei
 * console.log(nonJsonString()); // 2f389
 * console.log(nonJsonString()); // dfj32
 * // NOT
 * console.log(nonJsonString()); // 314
 * ```
 */
export function nonJsonString(): string {
	const length = 10;

	let res = '';
	let validJson = true;
	do {
		res = randomString(length);
		try {
			JSON.parse(res);
		} catch (err) {
			validJson = false;
		}
	} while (validJson);

	return res;
}
