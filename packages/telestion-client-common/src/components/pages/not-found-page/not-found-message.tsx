import { Link } from 'react-router-dom';
import { useAuth } from '@wuespace/telestion-client-core';
import { Heading, IllustratedMessage, Content } from '@adobe/react-spectrum';

import NotFound from '@spectrum-icons/illustrations/NotFound';

export function NotFoundMessage() {
	const auth = useAuth(state => state.auth);

	return (
		<IllustratedMessage>
			<NotFound />
			<Heading>Error 404: Page not found</Heading>
			<Content>
				{auth ? (
					<Link to="/dashboard">Return to dashboards</Link>
				) : (
					<Link to="/login">Return to dashboards</Link>
				)}
			</Content>
		</IllustratedMessage>
	);
}
