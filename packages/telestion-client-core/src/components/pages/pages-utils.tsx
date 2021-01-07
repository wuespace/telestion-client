import {
	isValidElement,
	JSXElementConstructor,
	ReactElement,
	ReactNode
} from 'react';
import { Routing } from '@wuespace/telestion-client-types';

import { getType, hasOwnProperty, isObj } from '../../lib/type-helpers';

// temporary solution for typing type property on createElement components
// TODO: Redesign types for Page components
export interface PageReactElement<
	P = any,
	T extends string | JSXElementConstructor<any> =
		| string
		| JSXElementConstructor<any>
> extends ReactElement<P, T> {
	type: T & {
		name: string;
		routing?: unknown;
	};
}

/**
 * Checks if the given child is a valid Page component that is an ReactElement.
 * @param child the child component to validate
 * @returns `true` if the child is a valid page component
 */
export function isValidChild(child: ReactNode): child is PageReactElement {
	return (
		isValidElement(child) &&
		isObj(child) &&
		hasOwnProperty(child, 'type') &&
		isObj(child.type)
	);
}

const types: Array<string> = ['auth', 'unAuth', 'default'];

/**
 * Checks the routing object of a page and returns a valid routing object. *
 * @param componentName the name of the Page component
 * @param obj the possible routing object attached to the Page component
 * @returns a valid routing object
 * @throws if the given routing object is not conform
 * with the defined {@link @wuespace/telestion-client-types#Routing} interface
 */
export function parseRouting(componentName: string, obj: unknown): Routing {
	if (obj == null) {
		throw new TypeError(
			`${componentName} is missing the 'routing' property. Please add one to continue`
		);
	}

	if (!isObj(obj)) {
		const type = getType(obj);
		throw new TypeError(
			`Invalid type of routing property of page ${componentName}` +
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
			`Invalid routing type for page ${componentName}` +
				` (expected: ${types.map(elem => `'${elem}'`).join(', ')}, got: ${type}`
		);
	}

	if (!(hasOwnProperty(obj, 'path') && typeof obj.path === 'string')) {
		const type = getType(obj.path);
		throw new TypeError(
			`Invalid type for path of page ${componentName}` +
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
				`Invalid type for redirect path of page ${componentName}` +
					` (expected: string, got: ${type})`
			);
		}
	}

	// TypeScript is dumb
	return obj as Routing;
}
