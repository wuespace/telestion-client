/* eslint-disable react/jsx-props-no-spreading */
import { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { StateSelector } from 'zustand';

import { AuthState, useAuth } from '../../../hooks';

// auth selector
const selector: StateSelector<AuthState, AuthState['auth']> = state =>
	state.auth;

/**
 * React Props of {@link UnAuthRoute}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link UnAuthRoute}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface UnAuthRouteProps
	extends Omit<RouteProps, 'children' | 'render'> {
	/**
	 * The redirect path to application is taking if nobody is logged in.
	 */
	redirectPath: string;

	/**
	 * Children given to the UnAuthRoute.
	 * They are rendered if nobody is logged in.
	 *
	 * @see {@link https://reactjs.org/docs/glossary.html#propschildren}
	 */
	children: ReactNode;
}

/**
 * A special route component that renders its {@link UnAuthRouteProps.children}
 * if nobody is logged in and otherwise redirects the application
 * to the specified {@link AuthRouteProps.redirectPath}.
 *
 * @see {@link AuthRouteProps}
 *
 * @example
 * ```ts
 * function MyPages() {
 * 	return (
 * 		<Pages>
 * 			<UnAuthRoute path="/login" redirectPath="/dashboards">
 * 				<Login />
 * 			</UnAuthRoute>
 *		</Pages>
 * 	);
 * }
 * ```
 */
export function UnAuthRoute({
	children,
	redirectPath,
	...rest
}: UnAuthRouteProps) {
	const auth = useAuth(selector);
	return (
		<Route
			{...rest}
			render={({ location }) =>
				auth ? (
					<Redirect
						to={{ pathname: redirectPath, state: { from: location } }}
					/>
				) : (
					children
				)
			}
		/>
	);
}

UnAuthRoute.propTypes = {
	redirectPath: PropTypes.string.isRequired,
	exact: PropTypes.bool,
	location: PropTypes.object,
	path: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.string)
	]),
	sensitive: PropTypes.bool,
	strict: PropTypes.bool
};
