import {
	isValidElement,
	JSXElementConstructor,
	ReactElement,
	ReactNode
} from 'react';
import { hasOwnProperty, isObj } from '../../../lib/core-utils';

/**
 * An extended version of {@link React.ReactElement}.
 *
 * Defines an attached object to the component renderer function
 * which possibly contains the routing information for a page.
 */
// temporary solution for typing type property on createElement components
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
	return isValidElement(child) && isObj(child) && hasOwnProperty(child, 'type');
}
