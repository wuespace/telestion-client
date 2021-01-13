import { intersection, difference, pick, keys } from 'lodash';
import { TestCase } from './test-prop-type';

//
// object structure tests
//

/**
 * Builds all unique combinations of a given list of elements.
 * @param list - the list of elements
 * @param minSlots - the minimal slots to occupy in the combination
 * @param maxSlots - the maximal slots to occupy in the combination
 * @returns a list of combinations of the input
 *
 * @example
 * ```ts
 * const myList = ['1', '2', '3'];
 * const combinations = combine(myList);
 * console.log(combinations);
 * // [], ['1'], ['2'], ['3'], ['1', '2'], ['2', '3'], ['1', '2', '3']
 * ```
 */
function combine<K>(
	list: Array<K>,
	minSlots = 0,
	maxSlots = list.length
): Array<Array<K>> {
	const holder: Array<Array<K>> = [];

	if (minSlots === 0) {
		holder.push([]);
	}

	for (
		let count = minSlots || 1;
		count <= Math.min(maxSlots, list.length);
		count++
	) {
		for (let start = 0; start <= list.length - count; start++) {
			holder.push(list.slice(start, start + count));
		}
	}
	return holder;
}

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
 * 	[
 * 		"object missing keys: 'type', 'path'",
 * 		{}
 * 	],
 * 	[
 * 		"object missing keys: 'path'",
 * 		{ type: "auth" }
 * 	],
 * 	[
 * 		"object missing keys: 'type'",
 * 		{ path: "/route" }
 * 	]
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

//
// object key type tests
//

const atomicTypes = [
	'undefined',
	'null',
	'boolean',
	'number',
	'string',
	'object',
	'array',
	'function',
	'symbol'
] as const;

/**
 * an atomic type in JavaScript that a value in a object can have
 */
type AtomicType = typeof atomicTypes[number];

const sampleAtomicTypes: { [key in AtomicType]: unknown } = {
	undefined,
	null: null,
	boolean: true,
	number: 3.14,
	string: 'The Box',
	object: {},
	array: [],
	function: () => {},
	symbol: Symbol('example symbol')
};

/**
 * Returns a stringified version of type.
 * @param type - the type to stringify
 * @returns the stringified version of type
 *
 * @example
 * ```ts
 *
 * ```
 */
function toString(type: unknown): string {
	if (typeof type === 'undefined') {
		return 'undefined';
	}
	if (type === null) {
		return 'null';
	}

	return (type as any).toString();
}

/**
 * Generates valid test cases for PropType object keys
 * using given value types.
 * @param key - the key of the object
 * @param validTypes - valid types of the value assigned to key
 * @param mergeWith - an object to merge with generated object
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
export function buildTestsWithValidObjectKeyValues(
	key: string,
	validTypes: unknown | Array<unknown>,
	mergeWith: Record<string, unknown>
): TestCase<Record<string, unknown>>[] {
	if (Array.isArray(validTypes)) {
		return validTypes.map((type: unknown) => [
			`object key '${key}' with valid type: '${toString(type)}'`,
			{ ...mergeWith, [key]: type }
		]);
	}

	return [
		[
			`object key '${key}' with valid type: '${toString(validTypes)}'`,
			{ ...mergeWith, [key]: validTypes }
		]
	];
}

/**
 * Generates invalid test cases for PropType object keys
 * using wrong value types.
 * @param key - the key of the object
 * @param validTypes - valid types of the value assigned to key
 * @param mergeWith - an object to merge with generated object
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
export function buildTestsWithInvalidObjectKeyValues(
	key: string,
	validTypes: AtomicType | Array<AtomicType>,
	mergeWith: Record<string, unknown>
): TestCase<Record<string, unknown>>[] {
	return atomicTypes
		.filter(type =>
			Array.isArray(validTypes)
				? !validTypes.includes(type)
				: type !== validTypes
		)
		.map(type => [
			`object key '${key}' with invalid type: '${type}'`,
			{ ...mergeWith, [key]: sampleAtomicTypes[type] }
		]);
}
