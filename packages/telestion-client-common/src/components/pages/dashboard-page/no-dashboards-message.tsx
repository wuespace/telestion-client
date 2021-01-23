import { IllustratedMessage, Heading, Content } from '@adobe/react-spectrum';
import NotFound from '@spectrum-icons/illustrations/NotFound';

export function NoDashboardsMessage() {
	return (
		<IllustratedMessage>
			<NotFound />
			<Heading>No dashboards defined</Heading>
			<Content>Lets create a dashboard!</Content>
		</IllustratedMessage>
	);
}
