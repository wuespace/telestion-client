/**
 * Returns a stringified version of type.
 * @param type - the type to stringify
 * @returns the stringified version of type
 *
 * @example
 * ```ts
 *
 * ```
 */
export function typeToString(type: unknown): string {
	if (typeof type === 'undefined') {
		return 'undefined';
	}
	if (type === null) {
		return 'null';
	}

	return (type as any).toString();
}
