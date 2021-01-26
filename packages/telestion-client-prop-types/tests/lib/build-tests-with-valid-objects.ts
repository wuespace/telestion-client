import { difference, intersection, keys, pick } from 'lodash';
import { TestCase } from './test-prop-type';
import { combine } from './combine';

//
// object structure tests
//

/**
 * Builds valid test cases for PropType objects
 * with combinations of optional keys.
 *
 * @param fullObj - the full specified object
 * with all required and optional defined keys
 * @param requiredKeys - the keys that are required
 * from the full object definition
 * @returns valid test cases for PropType objects
 *
 * @see {@link TestCase}
 * @see {@link testPropType}
 *
 * @example
 * ```ts
 * const fullObj = {
 * 	type: 'auth',
 * 	path: '/route',
 * 	exact: false,
 * 	additionalRedirects: []
 * };
 * const required = ['type', 'path'];
 *
 * const testCases = buildTestsWithValidObjects(fullObj, required);
 * console.log(testCases);
 * // Output:
 * [
 * 	[
 * 		"object with keys: 'type', 'path'",
 * 		{ type: "auth", path: "/route" }
 * 	],
 * 	[
 * 		"object with keys: 'exact', 'type', 'path'",
 * 		{ exact: false, type: "auth", path: "/route" }
 * 	],
 * 	[
 * 		"object with keys: 'additionalRedirects', 'type', 'path'",
 * 		{ additionalRedirects: [], type: "auth", path: "/route" }
 * 	],
 * 	[
 * 		"object with keys: 'exact', 'additionalRedirects', 'type', 'path'",
 * 		{ exact: false, additionalRedirects: [], type: "auth", path: "/route" }
 * 	}
 * ]
 * ```
 */
export function buildTestsWithValidObjects<O extends Record<string, unknown>>(
	fullObj: O,
	requiredKeys: Array<keyof O>
): Array<TestCase<O>> {
	const allKeys = keys(fullObj) as Array<keyof O>;
	const reqKeys = intersection(allKeys, requiredKeys);
	const optKeys = difference(allKeys, requiredKeys);

	return combine(optKeys)
		.map(combination => [...combination, ...reqKeys])
		.map(combination => [
			`object with keys: ${combination
				.map(key => `'${key.toString()}'`)
				.join(', ')}`,
			pick(fullObj, combination)
		]);
}

//
// object key type tests
//
