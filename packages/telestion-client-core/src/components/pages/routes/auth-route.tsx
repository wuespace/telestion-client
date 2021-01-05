/* eslint-disable react/jsx-props-no-spreading */
import { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, RouteProps } from 'react-router-dom';

import { useAuth } from '../../../hooks';

export interface AuthRouteProps
	extends Omit<RouteProps, 'children' | 'render'> {
	redirectPath: string;

	children: ReactNode;
}

export const AuthRoute = ({
	children,
	redirectPath,
	...rest
}: AuthRouteProps) => {
	const { user } = useAuth();
	return (
		<Route
			{...rest}
			render={({ location }) =>
				user ? (
					children
				) : (
					<Redirect
						to={{ pathname: redirectPath, state: { from: location } }}
					/>
				)
			}
		/>
	);
};

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
