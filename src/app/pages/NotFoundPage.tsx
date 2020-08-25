import React from 'react';
import { Link } from 'react-router-dom';
import { Heading, IllustratedMessage, Content } from '@adobe/react-spectrum';
import NotFound from '@spectrum-icons/illustrations/NotFound';

import useAuthState from '../../hooks/useAuthState';

export default function NotFoundPage() {
	const [{ credentials }] = useAuthState();

	return (
		<IllustratedMessage>
			<NotFound />
			<Heading>Error 404: Page not found</Heading>
			<Content>
				{credentials ? (
					<Link to="/dashboard">Return to dashboards</Link>
				) : (
					<Link to="/">Return to login page</Link>
				)}
			</Content>
		</IllustratedMessage>
	);
}
