/**
 * Type definition for an atomic type
 */
export type Atomic =
	| undefined
	| null
	| boolean
	| number
	| string
	| Record<string, unknown>
	| Array<unknown>
	// eslint-disable-next-line @typescript-eslint/ban-types
	| Function
	| symbol;
export const atomicTypes = [
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
export type AtomicType = (typeof atomicTypes)[number];
export const sampleAtomicTypes: { [key in AtomicType]: Atomic } = {
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
