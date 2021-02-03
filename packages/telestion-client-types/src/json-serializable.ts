/**
 * a type that only allows JSON serializable data
 *
 * @see {@link JSON.parse}
 * @see {@link JSON.stringify}
 */
export type JsonSerializable =
	| number
	| string
	| boolean
	| { [key: string]: JsonSerializable }
	| Array<JsonSerializable>;
