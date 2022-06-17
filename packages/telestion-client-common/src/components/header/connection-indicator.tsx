import { StateSelector } from 'zustand';
import { View, StatusLight } from '@adobe/react-spectrum';
import { SpectrumStatusLightProps } from '@react-types/statuslight';
import {
	ConnectionState,
	EventBusState,
	useEventBus
} from '@wuespace/telestion-client-core';
import { useSpectrumSize } from '../../hooks';

const variant: {
	[key in ConnectionState]: SpectrumStatusLightProps['variant'];
} = {
	connected: 'positive',
	disconnected: 'negative',
	error: 'yellow',
	noEventBus: 'neutral'
};

const label: { [key in ConnectionState]: string } = {
	connected: 'Connected',
	disconnected: 'Disconnected',
	error: 'Error',
	noEventBus: 'No Instance'
};

// event bus selector
const selector: StateSelector<
	EventBusState,
	EventBusState['connectionState']
> = state => state.connectionState;

/**
 * Part of the Telestion Client Common header.
 *
 * It displays the current connection status of the event bus
 * with a status light.
 *
 * @see {@link @wuespace/telestion-client-core#ConnectionState}
 * @see {@link https://react-spectrum.adobe.com/react-spectrum/StatusLight.html}
 * @see {@link Header}
 *
 * @example
 * ```ts
 * function AppHeader() {
 * 	return (
 * 		<Header
 * 			right={<ConnectionIndicator />}
 * 		/>
 * 	);
 * }
 * ```
 */
export function ConnectionIndicator({
	overrideState
}: {
	overrideState?: 'connected' | 'disconnected' | 'error' | 'noEventBus';
}) {
	const ebState = useEventBus(selector);
	const state = overrideState ?? ebState;
	// TODO: Clean up the override and props
	const size = useSpectrumSize();

	return size === 'base' ? (
		<View paddingTop="size-50">
			<StatusLight variant={variant[state]} />
		</View>
	) : (
		<View
			borderWidth="thin"
			borderColor="dark"
			borderRadius="medium"
			paddingStart="size-100"
			paddingEnd="size-200"
			paddingTop="size-50"
			width="size-1600"
		>
			<StatusLight variant={variant[state]}>{label[state]}</StatusLight>
		</View>
	);
}
