namespace TelestionClient {
	export type JsonSerializable =
		| number
		| string
		| boolean
		| Map<string, JsonSerializable>
		| Array<JsonSerializable>;
}
