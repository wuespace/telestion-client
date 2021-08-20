import { useCallback } from 'react';
import { MenuTrigger, DialogContainer } from '@adobe/react-spectrum';

import { useBooleanState } from '../../../hooks';
import { AvatarButton } from './avatar-button';
import { AvatarMenu } from './avatar-menu';
import { StatusDialog } from './status-dialog';
import { showDialog } from '../../../hooks/stores/use-dialog';

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

	const handleReset = useCallback(() => {
		void showDialog('telestion-client-common@reset-modal', {
			title: 'Reset configuration',
			content: 'Would you really like to reset your configuration?'
		}).then(() => {
			localStorage.clear();
			// eslint-disable-next-line no-restricted-globals
			location.reload();
		});
	}, []);

	return (
		<>
			<MenuTrigger>
				<AvatarButton />
				<AvatarMenu onStatusPress={openStatus} onResetPress={handleReset} />
			</MenuTrigger>

			<DialogContainer type="modal" isDismissable onDismiss={closeStatus}>
				{isStatusOpen && <StatusDialog />}
			</DialogContainer>
		</>
	);
}
