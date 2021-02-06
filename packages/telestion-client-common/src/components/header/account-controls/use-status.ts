import { useMemo } from 'react';
import { StateSelector } from 'zustand';
import {
	AuthState,
	ConnectionState,
	EventBusState,
	useAuth,
	useEventBus
} from '@wuespace/telestion-client-core';

const authSelector: StateSelector<AuthState, AuthState['auth']> = ({ auth }) =>
	auth;

const eventBusSelector: StateSelector<EventBusState, ConnectionState> = ({
	connectionState
}) => connectionState;

const mapToConnectionStatus: { [key in ConnectionState]: string } = {
	connected: 'Connected with backend server',
	disconnected: 'Disconnected from backend server',
	error: 'Error message received from backend server',
	noEventBus: 'No connection setup'
};

/**
 * A scope is an information entry in the status dialog.
 * It contains a description and a state.
 * The description is usually rendered before the state.
 */
interface Scope {
	/**
	 * The description of the information entry or scope.
	 */
	description: string;
	/**
	 * The current state of the scope.
	 */
	state: string;
}

/**
 * Returns the current status information (usually rendered by the {@link StatusDialog}).
 *
 * The returned `Scope` is an array of objects containing a `description` and a `state`.
 * `description`, then, provides a headline for a subsystem,
 * while `state` describes the current state of that subsystem.
 *
 * @see {@link StatusDialog}
 *
 * @example
 * ```ts
 * function MyStatusView() {
 * 	const status = useStatus();
 *
 * 	const items = useMemo(() => {
 * 		const children: Array<ReactNode> = [];
 *
 * 		status.forEach(({ description, state }) => {
 * 			children.push(
 * 				<Text key={`${description}-description`}>{description}</Text>
 * 			);
 * 			children.push(<Text key={`${description}-state`}>{state}</Text>);
 * 		});
 *
 * 		return children;
 * 	}, [status]);
 *
 * 	return (
 * 		<Grid
 * 			columns="max-content auto"
 * 			columnGap="size-200"
 * 			rowGap="size-100"
 * 		>
 * 			{items}
 * 		</Grid>
 * 	);
 * }
 * ```
 */
export function useStatus(): Array<Scope> {
	const auth = useAuth(authSelector);
	const connectionStatus = useEventBus(eventBusSelector);

	return useMemo(() => {
		return [
			{
				description: 'Connection status',
				state: mapToConnectionStatus[connectionStatus]
			},
			{
				description: 'Account',
				state: auth
					? `Logged in with username "${auth.username}"`
					: 'Logged out'
			},
			{
				description: 'Authentication server',
				state: auth ? auth.authServerUrl : 'none'
			},
			{
				description: 'Event bus server',
				state: auth ? auth.eventBusUrl : 'none'
			}
		];
	}, [auth, connectionStatus]);
}
