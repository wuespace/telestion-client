import { ReactText, useCallback } from 'react';
import { StateSelector } from 'zustand';
import { useHistory } from 'react-router-dom';
import { Menu, Section, Item, Text } from '@adobe/react-spectrum';
import { AuthState, useAuth } from '@wuespace/telestion-client-core';

import InfoOutline from '@spectrum-icons/workflow/InfoOutline';
import Login from '@spectrum-icons/workflow/Login';
import LogOut from '@spectrum-icons/workflow/LogOut';

const selector: StateSelector<
	AuthState,
	{
		isLoggedOut: boolean;
		signOut: AuthState['signOut'];
	}
> = ({ auth, signOut }) => ({ isLoggedOut: !auth, signOut });

export interface AvatarMenuProps {
	onStatusClick: () => void;
}

export function AvatarMenu({ onStatusClick }: AvatarMenuProps) {
	const history = useHistory();
	const { isLoggedOut, signOut } = useAuth(selector);

	const handleAction = useCallback(
		(key: ReactText) => {
			if (key === 'status') {
				onStatusClick();
			} else if (key === 'logout') {
				void signOut();
			} else if (key === 'login' && history.location.pathname !== '/login') {
				history.push('/login');
			}
		},
		[history, onStatusClick, signOut]
	);

	return (
		<Menu onAction={handleAction}>
			<Section title="Hello User!">
				<Item key="status">
					<InfoOutline size="S" />
					<Text>Status</Text>
				</Item>
				{isLoggedOut ? (
					<Item key="login">
						<Login size="S" />
						<Text>Login</Text>
					</Item>
				) : (
					<Item key="logout">
						<LogOut size="S" />
						<Text>Logout</Text>
					</Item>
				)}
			</Section>
		</Menu>
	);
}
