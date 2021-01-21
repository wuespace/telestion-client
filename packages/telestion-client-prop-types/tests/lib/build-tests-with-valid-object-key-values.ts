import { TestCase } from './test-prop-type';
import { typeToString } from './type-to-string';

/**
 * Generates valid test cases for PropType object keys
 * using given value types.
 *
 * @param fullObj - the full specified object
 * with all required and optional defined keys
 * @param key - the key of the object to test
 * @param validTypes - valid types of the value assigned to key
 * @returns invalid test cases for PropType object keys
 *
 * @typeParam T - the type of valid types
 * @typeParam M - the type of the object to merge
 *
 * @see {@link TestCase}
 * @see {@link testPropType}
 *
 * @example
 * ```ts
 *
 * ```
 */
export function buildTestsWithValidObjectKeyValues<
	O extends Record<string, unknown>,
	T
>(fullObj: O, key: keyof O, validTypes: Array<T>): Array<TestCase<O>> {
	return validTypes.map(type => [
		`object key '${key.toString()}' with valid type: '${typeToString(type)}'`,
		{ ...fullObj, [key]: type }
	]);
}
