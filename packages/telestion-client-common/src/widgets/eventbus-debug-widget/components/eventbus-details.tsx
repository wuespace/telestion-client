import { StateSelector } from 'zustand';
import shallow from 'zustand/shallow';
import {
	Content,
	Heading,
	IllustratedMessage,
	View
} from '@adobe/react-spectrum';
import { EventBusState, useEventBus } from '@wuespace/telestion-client-core';

import Unavailable from '@spectrum-icons/illustrations/Unavailable';

import { DetailsTable } from './details-table';
import { useErrorMessageState } from '../hooks';

/**
 * Type for the eventbus state selector.
 */
type Selector = StateSelector<
	EventBusState,
	Pick<EventBusState, 'eventBus' | 'error' | 'lastErrorMessage'>
>;
const selector: Selector = ({ eventBus, error, lastErrorMessage }) => ({
	eventBus,
	lastErrorMessage,
	error
});

/**
 * Shows details of the current eventbus connection,
 * e.g. connection state, number of sent and received messages
 * and received error messages.
 *
 * @example
 * ```tsx
 * <View width="100%" height="100%" padding="size-200">
 * 	<Flex direction="column" width="100%" height="100%">
 * 		<Header />
 * 		<EventbusDetails />
 * 	</Flex>
 * </View>
 * ```
 */
export function EventbusDetails() {
	const { eventBus, error, lastErrorMessage } = useEventBus(selector, shallow);
	const items = useErrorMessageState(lastErrorMessage);

	if (!eventBus) {
		return (
			<IllustratedMessage>
				<Unavailable />
				<Heading>No EventBus instance</Heading>
				<Content>
					There is currently no eventbus instance. Do you forget to create an
					eventbus connection?
				</Content>
			</IllustratedMessage>
		);
	}

	return (
		<>
			<View width="100%" overflow="auto">
				<DetailsTable eventBus={eventBus} error={error} isQuiet />
			</View>
			<View>
				<Heading level={4}>Last error messages</Heading>
				<View
					width="100%"
					height="size-2000"
					overflow="auto"
					backgroundColor="gray-200"
					borderRadius="regular"
				>
					{items.length === 0
						? 'none'
						: items.map(item => (
								<Content key={item.index}>{item.content}</Content>
						  ))}
				</View>
			</View>
		</>
	);
}
