import ValidationState from '../model/ValidationState';

export function isValidText(str: string): ValidationState {
	if (str.length === 0) return undefined;
	return str.length > 0 ? 'valid' : 'invalid';
}

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
