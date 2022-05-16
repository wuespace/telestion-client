declare module 'object-treeify' {
	export type TreeObject = {
		[key: string | number | symbol]: unknown;
	};

	export interface Options {
		/**
		 * By default, a single string is returned.
		 * Can be set to `false` to return an array containing lines instead.
		 *
		 * (default: `true`)
		 */
		joined?: boolean;

		/**
		 * Prefix for depth level when no further neighbour is present.
		 *
		 * (default: `'   '`)
		 */
		spacerNoNeighbour?: string;

		/**
		 * Prefix for depth level when a further neighbour is present.
		 *
		 * (default: `'│  '`)
		 */
		spacerNeighbour?: string;

		/**
		 * Prefix for key when no further neighbour is present.
		 *
		 * (default: `'└─ '`)
		 */
		keyNoNeighbour?: string;

		/**
		 * Prefix for key when a further neighbour is present.
		 *
		 * (default: `'├─ '`)
		 */
		keyNeighbour?: string;

		/**
		 * Function that defines the key sort order.
		 *
		 * Defaults to ordering of `Object.keys(...)`,
		 * which is typically insertion order.
		 */
		sortFn?: (
			a: string | number | symbol,
			b: string | number | symbol
		) => boolean;
	}

	function treeify(object: TreeObject, options?: Options): string | string[];
}
