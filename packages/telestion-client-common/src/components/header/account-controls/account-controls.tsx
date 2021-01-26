import { useCallback, useState } from 'react';
import { MenuTrigger, DialogContainer } from '@adobe/react-spectrum';
import { AvatarButton } from './avatar-button';
import { AvatarMenu } from './avatar-menu';
import { StatusDialog } from './status-dialog';

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
