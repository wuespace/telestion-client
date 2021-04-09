/**
 * Removes duplicates from a string array.
 * @param arr - an array with the duplicates
 * @returns an array without duplicates
 *
 * @example
 * ```ts
 * const duplicates = ['Hello', 'World', 'Hello', 'Foo', 'Foo'];
 * const uniques = filterDuplicates(duplicates);
 * console.log(uniques); // ['Hello', 'World', 'Foo']
 * ```
 */
export function filterDuplicates(arr: string[]): string[] {
	const hashTable: { [item: string]: boolean } = {};
	return arr.filter(item => {
		if (hashTable.hasOwnProperty(item)) {
			return false;
		}
		hashTable[item] = true;
		return true;
	});
}
