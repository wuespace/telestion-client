/**
 * A type guard to check if the given value is undefined.
 * @param value - the value to check if it is undefined
 * @typeParam T - the defined type of the value
 *
 * @example
 * ```ts
 * const myList = ['Foo', 42, undefined, 'bar'];
 *
 * myList.every(isDefinedValue); // false
 * ```
 */
export function isDefinedValue<T>(value: T | undefined): value is T {
	return typeof value !== 'undefined';
}
