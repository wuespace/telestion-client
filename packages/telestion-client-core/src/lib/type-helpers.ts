export type DefType =
	| 'string'
	| 'number'
	| 'bigint'
	| 'boolean'
	| 'symbol'
	| 'null'
	| 'undefined'
	| 'object'
	| 'function'
	| 'array';

/**
 * Get the type of the given variable or definable.
 * @param def the variable of definable to determine the type
 */
export function getType(def: unknown): DefType {
	// eslint-disable-next-line no-nested-ternary
	return Array.isArray(def) ? 'array' : def === null ? 'null' : typeof def;
}

/**
 * Checks if the given variable or definable is a valid object.
 * @param obj the variable or definable to check for valid object
 */
export function isObj(obj: unknown): obj is Record<string, unknown> {
	return obj !== null && typeof obj === 'object';
}

/**
 * Checks if a property exists on an object in a type-safe way.
 *
 * Many thanks to Stefan Baumgartner for this awesome typed function!
 *
 * @see https://fettblog.eu/typescript-hasownproperty/
 *
 * @param obj the object which maybe has the given property
 * @param prop the property to test for
 */
export function hasOwnProperty<
	X extends Record<string, unknown>,
	Y extends PropertyKey
>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
	return obj.hasOwnProperty(prop);
}
