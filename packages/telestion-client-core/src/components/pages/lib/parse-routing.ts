import { Routing } from '@wuespace/telestion-client-types';
import { getType, hasOwnProperty, isObj } from '../../../lib/core-utils';

const types: Array<Routing['type']> = ['auth', 'unAuth', 'default'];

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
			obj.type in types
		)
	) {
		const type = getType(obj.type);
		throw new TypeError(
			`Invalid routing type for page ${componentName}.` +
				` (expected: ${types.map(elem => `'${elem}'`).join(', ')}, got: ${type}`
		);
	}

	if (!(hasOwnProperty(obj, 'path') && typeof obj.path === 'string')) {
		const type = getType(obj.path);
		throw new TypeError(
			`Invalid type for path of page ${componentName}.` +
				` (expected: string, got: ${type})`
		);
	}

	if (obj.type === 'auth' || obj.type === 'unAuth') {
		if (
			!(
				hasOwnProperty(obj, 'redirectPath') &&
				typeof obj.redirectPath === 'string'
			)
		) {
			const type = getType(obj.redirectPath);
			throw new TypeError(
				`Invalid type for redirect path of page ${componentName}.` +
					` (expected: string, got: ${type})`
			);
		}
	}

	// TypeScript is dumb
	return obj as Routing;
}
