import { TestCase } from './test-prop-type';
import { typeToString } from './type-to-string';

/**
 * Generates invalid test cases for PropType object keys
 * using wrong values provided via arguments.
 *
 * @param fullObj - the full specified object
 * with all required and optional defined keys
 * @param key - the key of the object to test
 * @param invalidTypes - invalid types of the value assigned to key
 * @returns invalid test cases for PropType object keys
 *
 * @see {@link TestCase}
 * @see {@link testPropType}
 *
 * @example
 * ```ts
 *
 * ```
 */
export function buildTestsWithInvalidObjectKeyValues<
	O extends Record<string, unknown>,
	T
>(fullObj: O, key: keyof O, invalidTypes: Array<T>): Array<TestCase<O>> {
	return invalidTypes.map(type => [
		`object key '${key.toString()}' with invalid type: '${typeToString(type)}'`,
		{ ...fullObj, [key]: type }
	]);
}
