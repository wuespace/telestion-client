import { difference, intersection, keys, pick } from 'lodash';
import { TestCase } from './test-prop-type';
import { combine } from './combine';

/**
 * Builds invalid test cases for PropType objects missing required keys.
 *
 * @param fullObj - the full specified object
 * with all required and optional defined keys
 * @param requiredKeys - the keys that are required
 * from the full object definition
 * @returns invalid test cases for PropType objects missing required keys
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
 *    [
 *        "object missing keys: 'type', 'path'",
 *        {}
 *    ],
 *    [
 *        "object missing keys: 'path'",
 *        { type: "auth" }
 *    ],
 *    [
 *        "object missing keys: 'type'",
 *        { path: "/route" }
 *    ]
 * ]
 * ```
 */
export function buildTestsWithObjectsMissingRequiredKeys<
	O extends Record<string, unknown>
>(fullObj: O, requiredKeys: Array<keyof O>): Array<TestCase<O>> {
	const allKeys = keys(fullObj);
	const reqKeys = intersection(allKeys, requiredKeys);

	return combine(reqKeys, 0, reqKeys.length - 1).map(combination => [
		`object missing keys: ${difference(reqKeys, combination)
			.map(key => `'${key.toString()}'`)
			.join(', ')}`,
		pick(fullObj, combination)
	]);
}
