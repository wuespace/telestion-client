import React from 'react';
import { useParams, Redirect } from 'react-router-dom';
import NotFound from '@spectrum-icons/illustrations/NotFound';
import { Content, Heading, IllustratedMessage, Flex, ProgressCircle } from '@adobe/react-spectrum';

import Dashboard from '../components/Dashboard';
import useAuthState from '../../hooks/useAuthState';
import userDashboards from '../../lib/userDashboards';
import { setError } from '../../model/AuthState';

interface Props {
	userIsAuthenticated: boolean;
}

export default function DashboardPage({ userIsAuthenticated }: Props) {
	const { id } = useParams();
	const [{ credentials }, authDispatch] = useAuthState();

	if (userIsAuthenticated) {
		if (!credentials) {
			authDispatch(
				setError('User credentials not available. Please log in first')
			);
			return <Redirect to="/" />;
		}

		const dashboards = userDashboards[credentials.username];
		if (dashboards.length > 0) {
			const dashboard = dashboards[id];
			return dashboard ? (
				<Dashboard dashboard={dashboard} />
			) : (
				<Redirect to="/dashboard/0" />
			);
		}

		return (
			<IllustratedMessage>
				<NotFound />
				<Heading>No dashboards found</Heading>
				<Content>
					Add dashboard definitions in the src/lib/userDashboards.ts file for
					your username "{credentials.username}"
				</Content>
			</IllustratedMessage>
		);
	}

	return (
		<Flex direction="column" justifyContent="center" alignItems="center">
			<ProgressCircle aria-label="Logging in" isIndeterminate />
			<Heading level={2}>Logging in…</Heading>
		</Flex>
	)
}
