import React from 'react';
import { Heading, IllustratedMessage, Content } from '@adobe/react-spectrum';
import NotFound from '@spectrum-icons/illustrations/NotFound';
import { Link } from 'react-router-dom';

import useAppState from '../../hooks/useAppState';

export default function NotFoundPage() {
	const [{ user }] = useAppState();

	return (
		<IllustratedMessage>
			<NotFound />
			<Heading>Error 404: Page not found</Heading>
			<Content>
				{user ? (
					<Link to="/dashboard">Return to dashboards</Link>
				) : (
					<Link to="/">Return to login page</Link>
				)}
			</Content>
		</IllustratedMessage>
	);
}
