/**
 * type for a valid message to transfer via the event bus
 */
export type JsonSerializable =
	| number
	| string
	| boolean
	| Map<string, JsonSerializable>
	| Array<JsonSerializable>;
