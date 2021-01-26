import { ValidationState as SpectrumValidationState } from '@react-types/shared';

/**
 * The current state of a validation.
 * It can have the possible values:
 * - `'valid'` - input is valid
 * - `'invalid'` - input is invalid
 * - `undefined` - no input is set yet
 */
export type ValidationState = SpectrumValidationState | undefined;

/**
 * Checks if the current string is valid.
 * @param str - string to test
 * @returns 'valid' if the string is valid otherwise 'invalid'
 * or if the string is empty then undefined
 *
 * @example
 * ```ts
 * console.log(isValidText('Hello World')); // 'valid'
 * console.log(isValidText('')); // undefined
 * ```
 */
export function isValidText(str: string): ValidationState {
	if (str.length === 0) return undefined;
	return str.length > 0 ? 'valid' : 'invalid';
}

/**
 * Checks if the current string a valid url with http: or https: protocol.
 * @param str - string to test
 * @returns 'valid' if the string a valid url with http: or https: protocol
 * otherwise 'invalid' or if the string is empty then undefined
 *
 * @example
 * ```ts
 * console.log(isValidHttpUrl('Hello World')); // 'invalid'
 * console.log(isValidHttpUrl('')); // undefined
 * console.log(isValidHttpUrl('ftp://localhost/')); // 'invalid'
 * console.log(isValidHttpUrl('http://localhost/')); // 'valid'
 * console.log(isValidHttpUrl('https://localhost/')); // 'valid'
 * ```
 */
export function isValidHttpUrl(str: string): ValidationState {
	if (str.length === 0) return undefined;

	let url;
	try {
		url = new URL(str);
	} catch (_) {
		return 'invalid';
	}

	return url.protocol === 'http:' || url.protocol === 'https:'
		? 'valid'
		: 'invalid';
}
