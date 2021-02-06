import { IllustratedMessage, Heading, Content } from '@adobe/react-spectrum';
import NotFound from '@spectrum-icons/illustrations/NotFound';

/**
 * Renders an illustrated message from React Spectrum
 * containing a _no dashboards_ heading for when no dashboard has been created for the current user.
 *
 * It is usually used in the {@link DashboardPage}.
 *
 * @see {@link @adobe/react-spectrum#IllustratedMessage}
 * @see {@link DashboardPage}
 *
 * @example
 * ```ts
 * function MyDashboardPage() {
 * 	const [dashboards] = useCurrentDashboards();
 *
 * 	if (!dashboards) {
 * 		return <NoDashboardsMessage />;
 * 	}
 *
 * 	return <Dashboard dashboard={dashboards[0]} />;
 * }
 * ```
 */
export function NoDashboardsMessage() {
	return (
		<IllustratedMessage>
			<NotFound />
			<Heading>No dashboards defined</Heading>
			<Content>Lets create a dashboard!</Content>
		</IllustratedMessage>
	);
}
