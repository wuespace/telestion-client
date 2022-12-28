import { Flex, Heading, ProgressCircle } from '@adobe/react-spectrum';

/**
 * Renders a full size page with a loading indicator
 * indicating a missing event bus instance.
 *
 * It is usually used in the {@link DashboardPage}.
 *
 * @see {@link DashboardPage}
 *
 * @example
 * ```tsx
 * function MyDashboardPage() {
 * 	const eventBus = useEventBus(selector);
 *
 * 	if (!eventBus) {
 * 		return <MissingEventBus />;
 * 	}
 *
 * 	return <Dashboard dashboard={dashboards[0]} />;
 * }
 * ```
 */
export function MissingEventBus() {
	return (
		<Flex
			width="100%"
			height="100%"
			direction="column"
			justifyContent="center"
			alignItems="center"
			data-testid="telestionClientMissingEventBus"
		>
			<ProgressCircle
				aria-label="Waiting for event bus instance…"
				isIndeterminate
			/>
			<Heading level={2}>Waiting for event bus instance…</Heading>
			<p style={{ textAlign: 'center' }}>
				If this message persists, try to reload the application.
				<br />
				If this still doesn&apos;t help, please contact your trusted Telestion
				developer. 😉
			</p>
		</Flex>
	);
}
