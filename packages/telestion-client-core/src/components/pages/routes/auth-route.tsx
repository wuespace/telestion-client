import { FC } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { useAuth } from '../../../hooks';

export interface AuthRouteProps {
	redirectPath: string;
}

export const AuthRoute: FC<AuthRouteProps> = ({
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
