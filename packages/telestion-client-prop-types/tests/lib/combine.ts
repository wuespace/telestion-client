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
export function combine<K>(
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
