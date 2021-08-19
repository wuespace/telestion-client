import { useCallback, useState } from 'react';
import { MenuTrigger, DialogContainer } from '@adobe/react-spectrum';

import { AvatarButton } from './avatar-button';
import { AvatarMenu } from './avatar-menu';
import { StatusDialog } from './status-dialog';
import { ResetDialog } from './reset-dialog';

/**
 * Part of the Telestion Client Common header.
 *
 * This header component lets the user review
 * and control their login and authentication status.
 *
 * It displays the current login status
 * as well as some further information about the event bus state.
 *
 * It renders a simple avatar icon with a dropdown menu attached to it.
 *
 * @see {@link Header}
 *
 * @example
 * ```ts
 * function AppHeader() {
 * 	return (
 * 		<Header
 * 			right={
 * 				<AccountControls />
 * 			}
 * 		/>
 * 	);
 * }
 * ```
 */
export function AccountControls() {
	// dialog open state
	const [isStatusOpen, setStatusOpen] = useState(false);
	const [isResetOpen, setResetOpen] = useState(false);

	const openStatus = useCallback(() => setStatusOpen(true), []);
	const closeStatus = useCallback(() => setStatusOpen(false), []);

	const openReset = useCallback(() => setResetOpen(true), []);
	const abortReset = useCallback(() => setResetOpen(false), []);
	const continueReset = useCallback(() => {
		setResetOpen(false);
		localStorage.clear();
		// eslint-disable-next-line no-restricted-globals
		location.reload();
	}, []);

	return (
		<>
			<MenuTrigger>
				<AvatarButton />
				<AvatarMenu onStatusPress={openStatus} onResetPress={openReset} />
			</MenuTrigger>

			<DialogContainer type="modal" isDismissable onDismiss={closeStatus}>
				{isStatusOpen && <StatusDialog />}
			</DialogContainer>

			<DialogContainer type="modal" onDismiss={abortReset}>
				{isResetOpen && (
					<ResetDialog onConfirm={continueReset} onCancel={abortReset} />
				)}
			</DialogContainer>
		</>
	);
}
