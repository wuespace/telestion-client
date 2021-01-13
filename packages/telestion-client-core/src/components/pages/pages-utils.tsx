import {
	isValidElement,
	JSXElementConstructor,
	ReactElement,
	ReactNode
} from 'react';
import { Routing } from '@wuespace/telestion-client-types';

import { getType, hasOwnProperty, isObj } from '../../lib/core-utils';

/**
 * An extended version of {@link React.ReactElement}.
 *
 * Defines an attached object to the component renderer function
 * which possibly contains the routing information for a page.
 */
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
 * Checks if the given child is a valid Page component
 * which has an attached routing object.
 *
 * @param child - the child component to validate
 * @returns `true` if the child is a valid page component
 *
 * @see {@link PageReactElement}
 *
 * @example
 * ```ts
 * function MyPage() {
 *   return <div>MyPage<div>;
 * }
 *
 * MyPage.routing: Routing = {
 * 	type: 'default',
 * 	path: '/route'
 * };
 *
 * isValidChild(MyPage); // true
 * ```
 */
export function isValidChild(child: ReactNode): child is PageReactElement {
	return (
		isValidElement(child) &&
		isObj(child) &&
		hasOwnProperty(child, 'type') &&
		isObj(child.type)
	);
}

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
