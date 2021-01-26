/**
 * the type of a definable or variable in JavaScript
 *
 * @see {@link getType}
 */
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
 * @param def - the variable of definable to determine the type
 *
 * @example
 * ```ts
 * getType(undefined); // 'undefined'
 * getType(null); // 'null'
 * getType('Hello'); // 'string'
 * getType(false); // 'boolean'
 * getType({}); // 'object'
 * getType([]); // 'array'
 * getType(() => {}); // 'function'
 * ...
 * ```
 */
export function getType(def: unknown): DefType {
	// eslint-disable-next-line no-nested-ternary
	return Array.isArray(def) ? 'array' : def === null ? 'null' : typeof def;
}

/**
 * Checks if the given variable or definable is a valid object.
 * @param obj - the variable or definable to check for valid object
 *
 * @example
 * # Valid object
 * ```ts
 * const myObj = {};
 * if (isObj(myObj)) {
 * 	console.log('It\'s an object!'); // 'It's an object!'
 * }
 * ```
 *
 * # Not a valid object
 * ```ts
 * const myValue = 3.14;
 * if (isObj(myValue)) {
 * 	...
 * } else {
 * 	console.log('It\'s not an object!'); // 'It's not an object!'
 * }
 * ```
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
 * @param obj - the object which maybe has the given property
 * @param prop - the property to test for
 *
 * @example
 * ```ts
 * const someObj: Record<string, unknown> = {
 *   value: 'Hello World'
 * };
 *
 * if (hasOwnProperty(someObj, 'value')) {
 * 	// proved TypeScript existence of property 'value'
 * 	console.log(someObj.value); // 'Hello World'
 * }
 * ```
 */
export function hasOwnProperty<
	X extends Record<string, unknown>,
	Y extends PropertyKey
>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
	return obj.hasOwnProperty(prop);
}

/**
 * Checks if an object is empty (has no well defined properties left).
 *
 * Many thanks to Adam Zerner for his implementation.
 * @see https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
 *
 * @param obj - the object to test
 * @returns `true` if the object is empty
 *
 * @example
 * ```ts
 * let myObj = {
 *   value: 'Delete Me!'
 * };
 *
 * delete myObj.value;
 *
 * if (isEmpty(myObj)) {
 * 	// object is empty can safely be deleted
 * 	myObj = undefined;
 * }
 * ```
 */
export function isEmpty(obj: Record<string, unknown>): boolean {
	return Object.keys(obj).length === 0 && obj.constructor === Object;
}
