import { useCallback, useState } from 'react';
import { MenuTrigger, DialogContainer } from '@adobe/react-spectrum';
import { AvatarButton } from './avatar-button';
import { AvatarMenu } from './avatar-menu';
import { StatusDialog } from './status-dialog';

/**
 * Part of the Telestion Client Common header.
 *
 * This header component lets the user review
 * and control his login and authentication status.
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
	const [isOpen, setOpen] = useState(false);

	const openDialog = useCallback(() => setOpen(true), []);
	const closeDialog = useCallback(() => setOpen(false), []);

	return (
		<>
			<MenuTrigger>
				<AvatarButton />
				<AvatarMenu onStatusClick={openDialog} />
			</MenuTrigger>

			<DialogContainer type="modal" isDismissable onDismiss={closeDialog}>
				{isOpen && <StatusDialog />}
			</DialogContainer>
		</>
	);
}
