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
 * React Props of {@link AuthRoute}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link AuthRoute}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface AuthRouteProps
	extends Omit<RouteProps, 'children' | 'render'> {
	/**
	 * The redirect path to application is taking if nobody is logged in.
	 */
	redirectPath: string;

	/**
	 * Children given to the AuthRoute.
	 * They are rendered if the user is logged in.
	 *
	 * @see {@link https://reactjs.org/docs/glossary.html#propschildren}
	 */
	children: ReactNode;
}

/**
 * A special route component that renders its {@link AuthRouteProps.children}
 * if the user is logged in and otherwise redirects the application
 * to the specified {@link AuthRouteProps.redirectPath}.
 *
 * @see {@link AuthRouteProps}
 *
 * @example
 * ```ts
 * function MyPages() {
 * 	return (
 * 		<Pages>
 * 			<AuthRoute path="/dashboards" redirectPath="/login">
 * 				<Dashboard />
 * 			</AuthRoute>
 *		</Pages>
 * 	);
 * }
 * ```
 */
export function AuthRoute({ children, redirectPath, ...rest }: AuthRouteProps) {
	const auth = useAuth(selector);
	return (
		<Route
			{...rest}
			render={({ location }) =>
				auth ? (
					children
				) : (
					<Redirect
						to={{ pathname: redirectPath, state: { from: location } }}
					/>
				)
			}
		/>
	);
}

AuthRoute.propTypes = {
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
