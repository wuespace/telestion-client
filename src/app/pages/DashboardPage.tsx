import React from 'react';
import { useParams, Redirect } from 'react-router-dom';
import NotFound from '@spectrum-icons/illustrations/NotFound';
import {
	Content,
	Heading,
	IllustratedMessage,
	Flex,
	ProgressCircle
} from '@adobe/react-spectrum';

import { setError } from '../../model/AuthState';

import Dashboard from '../components/Dashboard';
import Header from '../components/Header';
import useAuthState from '../../hooks/useAuthState';
import userDashboards from '../../lib/userDashboards';

export default function DashboardPage() {
	const { id } = useParams<{ id: string }>();
	const [{ credentials, authenticated }, authDispatch] = useAuthState();

	if (authenticated) {
		if (!credentials) {
			authDispatch(
				setError('User credentials not available. Please log in first')
			);
			return <Redirect to="/" />;
		}

		const dashboards = userDashboards[credentials.username] || [];
		if (dashboards.length > 0) {
			const dashboard = dashboards[Number.parseInt(id)];
			return dashboard ? (
				<>
					<Header />
					<Dashboard dashboard={dashboard} />
				</>
			) : (
				<Redirect to="/dashboard/0" />
			);
		}

		return (
			<>
				<Header />
				<IllustratedMessage>
					<NotFound />
					<Heading>No dashboards found</Heading>
					<Content>
						Add dashboard definitions in the src/lib/userDashboards.ts file for
						your username "{credentials.username}"
					</Content>
				</IllustratedMessage>
			</>
		);
	}

	return (
		<Flex direction="column" justifyContent="center" alignItems="center">
			<ProgressCircle aria-label="Logging in" isIndeterminate />
			<Heading level={2}>Logging in…</Heading>
		</Flex>
	);
}
