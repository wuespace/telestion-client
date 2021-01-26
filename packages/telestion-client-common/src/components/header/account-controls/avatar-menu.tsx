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
		auth: AuthState['auth'];
		signOut: AuthState['signOut'];
	}
> = ({ auth, signOut }) => ({ auth, signOut });

export interface AvatarMenuProps {
	onStatusClick: () => void;
}

export function AvatarMenu({ onStatusClick }: AvatarMenuProps) {
	const history = useHistory();
	const { auth, signOut } = useAuth(selector);

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
			<Section title={auth ? `Hello ${auth.username}!` : `Sign in`}>
				<Item key="status">
					<InfoOutline size="S" />
					<Text>Status</Text>
				</Item>
				{!auth ? (
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
