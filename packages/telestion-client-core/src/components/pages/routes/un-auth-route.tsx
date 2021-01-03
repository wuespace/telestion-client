import { FC } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, RouteProps } from 'react-router-dom';

import { useAuth } from '../../../hooks';

export interface UnAuthRouteProps
	extends Omit<RouteProps, 'children' | 'render'> {
	redirectPath: string;
}

const UnAuthRoute: FC<UnAuthRouteProps> = ({
	children,
	redirectPath,
	...rest
}) => {
	const { user } = useAuth();
	return (
		<Route
			{...rest}
			render={({ location }) =>
				user ? (
					<Redirect
						to={{ pathname: redirectPath, state: { from: location } }}
					/>
				) : (
					children
				)
			}
		/>
	);
};

UnAuthRoute.propTypes = {
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

export { UnAuthRoute };
