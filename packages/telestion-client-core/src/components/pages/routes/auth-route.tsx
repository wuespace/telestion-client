import { FC } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, RouteProps } from 'react-router-dom';

import { useAuth } from '../../../hooks';

export interface AuthRouteProps
	extends Omit<RouteProps, 'children' | 'render'> {
	redirectPath: string;
}

const AuthRoute: FC<AuthRouteProps> = ({ children, redirectPath, ...rest }) => {
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
	// @ts-ignore
	location: PropTypes.object,
	path: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.string)
	]),
	sensitive: PropTypes.bool,
	strict: PropTypes.bool
};

export { AuthRoute };
