import {
	ActionButton,
	Flex,
	Heading,
	Tooltip,
	TooltipTrigger,
	View
} from '@adobe/react-spectrum';
import { BaseRendererProps } from '@wuespace/telestion-client-types';

import Refresh from '@spectrum-icons/workflow/Refresh';

import { EventbusDetails } from './components/eventbus-details';
import { useAutoRefresh } from './hooks';

/**
 * Renders the eventbus debug widget.
 * @param title - the tittle supplied by the user configuration
 *
 * @example
 * ```tsx
 * function WidgetRenderer() {
 * 	return (
 * 		<OverflowFix>
 * 			<Widget title="Eventbus Debug" />
 * 		</OverflowFix>
 * 	)
 * }
 * ```
 */
export function Widget({ title }: BaseRendererProps) {
	const refresh = useAutoRefresh();

	return (
		<View width="100%" height="100%" padding="size-200">
			<Flex direction="column" width="100%" height="100%">
				<Flex
					flexGrow={0}
					direction="row"
					justifyContent="space-between"
					alignItems="baseline"
				>
					<Heading marginTop={0} flexGrow={0} level={3}>
						{title}
					</Heading>
					<TooltipTrigger>
						<ActionButton aria-label="Refresh" isQuiet onPress={refresh}>
							<Refresh />
						</ActionButton>
						<Tooltip>Refresh</Tooltip>
					</TooltipTrigger>
				</Flex>

				<EventbusDetails />
			</Flex>
		</View>
	);
}
