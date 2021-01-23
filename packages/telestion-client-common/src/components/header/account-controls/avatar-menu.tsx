import { ReactText, useCallback } from 'react';
import { StateSelector } from 'zustand';
import { Menu, Section, Item, Text } from '@adobe/react-spectrum';
import { AuthState, useAuth } from '@wuespace/telestion-client-core';

import InfoOutline from '@spectrum-icons/workflow/InfoOutline';
import LogOut from '@spectrum-icons/workflow/LogOut';

const selector: StateSelector<AuthState, AuthState['signOut']> = ({
	signOut
}) => signOut;

export interface AvatarMenuProps {
	onStatusClick: () => void;
}

export function AvatarMenu({ onStatusClick }: AvatarMenuProps) {
	const signOut = useAuth(selector);
	const handleAction = useCallback(
		(key: ReactText) => {
			if (key === 'status') {
				onStatusClick();
			} else if (key === 'logout') {
				void signOut();
			}
		},
		[onStatusClick, signOut]
	);

	return (
		<Menu onAction={handleAction}>
			<Section title="Hello User!">
				<Item key="status">
					<InfoOutline size="S" />
					<Text>Status</Text>
				</Item>
				<Item key="logout">
					<LogOut size="S" />
					<Text>Logout</Text>
				</Item>
			</Section>
		</Menu>
	);
}
