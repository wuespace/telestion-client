import { FC } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { useAuth } from '../../../hooks';

export interface UnAuthRouteProps {
	redirectPath: string;
}

export const UnAuthRoute: FC<UnAuthRouteProps> = ({
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
