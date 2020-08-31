/**
 * A JSON-serializable type that can get sent back as JSON via HTTP/-S
 */
type JSONSerializable =
	| number
	| string
	| boolean
	| { [key: string]: JSONSerializable }
	| JSONSerializable[];

export default JSONSerializable;
