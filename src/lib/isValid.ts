import ValidationState from '../model/ValidationState';

/**
 * Checks if the current string is valid.
 * @param str string to test
 * @returns 'valid' if the string is valid otherwise 'invalid'
 * or if the string is empty then undefined
 */
export function isValidText(str: string): ValidationState {
	if (str.length === 0) return undefined;
	return str.length > 0 ? 'valid' : 'invalid';
}

/**
 * Checks if the current string a valid url with http: or https: protocol.
 * @param str string to test
 * @returns 'valid' if the string a valid url with http: or https: protocol
 * otherwise 'invalid' or if the string is empty then undefined
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
