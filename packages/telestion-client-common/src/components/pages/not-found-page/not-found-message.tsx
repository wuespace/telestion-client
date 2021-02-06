import { Link } from 'react-router-dom';
import { useAuth } from '@wuespace/telestion-client-core';
import { Heading, IllustratedMessage, Content } from '@adobe/react-spectrum';

import NotFound from '@spectrum-icons/illustrations/NotFound';

/**
 * Renders an illustrated message from React Spectrum
 * containing a 404 page not found heading and a button to return
 * to the dashboard page if the some is authenticated.
 * Otherwise it returns to the login page.
 *
 * It is usually used in the {@link NotFoundPage}.
 *
 * @see {@link @adobe/react-spectrum#IllustratedMessage}
 * @see {@link NotFoundPage}
 *
 * @example
 * ```ts
 * function MyNotFoundPage() {
 * 	return <NotFoundMessage />;
 * }
 * ```
 */
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
