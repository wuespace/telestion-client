import { AtomicType, atomicTypes, sampleAtomicTypes } from './atomics';
import { TestCase } from './test-prop-type';

/**
 * Generates invalid test cases for PropType object keys
 * using wrong value atomics.
 *
 * @param fullObj - the full specified object
 * with all required and optional defined keys
 * @param key - the key of the object to test
 * @param validTypes - valid atomic types of the value assigned to key
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
export function buildTestsWithInvalidObjectKeyAtomics<
	O extends Record<string, unknown>
>(fullObj: O, key: keyof O, validTypes: Array<AtomicType>): Array<TestCase<O>> {
	return atomicTypes
		.filter(type => !validTypes.includes(type))
		.map(type => [
			`object key '${key.toString()}' with invalid type: '${type}'`,
			{ ...fullObj, [key]: sampleAtomicTypes[type] }
		]);
}
