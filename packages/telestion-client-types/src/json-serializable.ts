export type JsonSerializable =
	| number
	| string
	| boolean
	| { [key: string]: JsonSerializable }
	| Array<JsonSerializable>;
