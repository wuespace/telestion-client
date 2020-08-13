import React from 'react';
import NotFound from '@spectrum-icons/illustrations/NotFound';
import { Content, Heading, IllustratedMessage } from '@adobe/react-spectrum';
import { useParams, Redirect } from 'react-router-dom';

import Dashboard from '../components/Dashboard';
import useAppState from '../../hooks/useAppState';

export default function DashboardPage() {
	const [{ user }] = useAppState();
	const { id } = useParams();

	if (user!.dashboards.length > 0) {
		const dashboard = user!.dashboards[id];
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
				Add dashboard definitions in the src/lib/userDashboards.ts file for your
				user type "{user!.type}"
			</Content>
		</IllustratedMessage>
	);
}
