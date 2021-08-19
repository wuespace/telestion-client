import { useCallback } from 'react';
import { MenuTrigger, DialogContainer } from '@adobe/react-spectrum';

import { useBooleanState } from '../../../hooks';
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
	const [isStatusOpen, openStatus, closeStatus] = useBooleanState();
	const [isResetOpen, openReset, closeReset] = useBooleanState();

	const resetConfig = useCallback(() => {
		closeReset();
		localStorage.clear();
		// eslint-disable-next-line no-restricted-globals
		location.reload();
	}, [closeReset]);

	return (
		<>
			<MenuTrigger>
				<AvatarButton />
				<AvatarMenu onStatusPress={openStatus} onResetPress={openReset} />
			</MenuTrigger>

			<DialogContainer type="modal" isDismissable onDismiss={closeStatus}>
				{isStatusOpen && <StatusDialog />}
			</DialogContainer>

			<DialogContainer type="modal" onDismiss={closeReset}>
				{isResetOpen && (
					<ResetDialog onConfirm={resetConfig} onCancel={closeReset} />
				)}
			</DialogContainer>
		</>
	);
}
