import { Routing } from '@wuespace/telestion-client-types';
import { getType, hasOwnProperty, isObj } from '../../../lib/core-utils';

const types = ['auth', 'unAuth', 'default'];

/**
 * Checks the routing object of a page
 * and returns it if is parsable and valid.
 *
 * @param componentName - the name of the component
 * @param obj - the possible routing object attached to the Page component
 * @returns a valid routing object and throws otherwise
 *
 * @throws if the given routing object does not conform
 * the {@link @wuespace/telestion-client-types#Routing} definition
 *
 * @example
 * ```ts
 * const someRouting = {
 * 	type: 'default',
 * 	path: '/route'
 * };
 *
 * const validRouting = parseRouting('MyComponent', someRouting);
 * // do something with validRouting
 * ```
 */
export function parseRouting(componentName: string, obj: unknown): Routing {
	if (obj == null) {
		throw new TypeError(
			`${componentName} is missing the 'routing' property. Please add one to continue.`
		);
	}

	if (!isObj(obj)) {
		const type = getType(obj);
		throw new TypeError(
			`Invalid type of routing property of page ${componentName}.` +
				` (expected: object, got: ${type})`
		);
	}

	if (
		!(
			hasOwnProperty(obj, 'type') &&
			typeof obj.type === 'string' &&
			types.includes(obj.type)
		)
	) {
		const type = getType(obj.type);
		throw new TypeError(
			`Invalid routing type for page ${componentName}.` +
				` (expected: ${types
					.map(elem => `'${elem}'`)
					.join(', ')}, got: ${type})`
		);
	}

	checkProperty(componentName, obj, 'path', 'string');

	if (obj.type === 'auth' || obj.type === 'unAuth') {
		checkProperty(componentName, obj, 'redirectPath', 'string');
	}

	// TypeScript is dumb
	return (obj as unknown) as Routing;
}

/**
 * Checks the `obj` for a `prop` and throws if it's invalid
 *
 * @param pageName - the page's name, for the error message
 * @param obj - the object whose properties should get checked
 * @param prop - the key/name of the prop in `obj` that gets checked
 * @param expectedType - the expected type. Must equal the expected `typeof obj[prop]`.
 *
 * @throws a `TypeError` if the `obj[prop]` doesn't exist or `typeof obj[prop] !== expectedType`.
 *
 * @example
 * ```ts
 * checkProperty(componentName, obj, 'path', 'string');
 * ```
 */
function checkProperty(
	pageName: string,
	obj: Record<string, unknown>,
	prop: keyof typeof obj,
	expectedType: 'string' | 'boolean' | 'number'
): void {
	// eslint-disable-next-line valid-typeof
	if (!(hasOwnProperty(obj, prop) && typeof obj[prop] === expectedType)) {
		const actualType = getType(obj.path);
		throw new TypeError(
			`Invalid type for ${prop} of page ${pageName}.` +
				` (expected: ${actualType}, got: ${actualType})`
		);
	}
}
