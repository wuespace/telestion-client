/**
 * Checks if an object is empty (has no well defined properties left).
 *
 * Many thanks to Adam Zerner for his implementation.
 * @see https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
 *
 * @param obj the object to test
 * @returns `true` if the object is empty
 */
export function isEmpty(obj: object): boolean {
	return Object.keys(obj).length === 0 && obj.constructor === Object;
}
