import { ReactText, useCallback } from 'react';
import { StateSelector } from 'zustand';
import { useHistory } from 'react-router-dom';
import { Menu, Section, Item, Text } from '@adobe/react-spectrum';
import { AuthState, useAuth } from '@wuespace/telestion-client-core';

import InfoOutline from '@spectrum-icons/workflow/InfoOutline';
import PagesExclude from '@spectrum-icons/workflow/PagesExclude';
import Login from '@spectrum-icons/workflow/Login';
import LogOut from '@spectrum-icons/workflow/LogOut';

const selector: StateSelector<
	AuthState,
	{
		auth: AuthState['auth'];
		signOut: AuthState['signOut'];
	}
> = ({ auth, signOut }) => ({ auth, signOut });

/**
 * React Props of {@link AvatarMenu}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link AvatarMenu}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface AvatarMenuProps {
	/**
	 * An event that triggers when the user presses the status menu entry.
	 */
	onStatusPress: () => void;

	/**
	 * An event that triggers when the user presses
	 * the reset configuration menu entry.
	 */
	onResetPress: () => void;
}

/**
 * Renders the account controls menu.
 *
 * It contains actions to log into and out of the application
 * and show the current app status.
 *
 * Typically used with the {@link AvatarButton} in a
 * {@link @adobe/react-spectrum#MenuTrigger}
 * to control the menu with the avatar button.
 *
 * @see {@link AvatarMenuProps}
 * @see {@link AvatarButton}
 *
 * @example
 * ```ts
 * function MyAccountControls() {
 * 	return (
 * 		<MenuTrigger>
 * 			<AvatarButton />
 * 			<AvatarMenu />
 * 		</MenuTrigger>
 * 	);
 * }
 * ```
 */
export function AvatarMenu({ onStatusPress, onResetPress }: AvatarMenuProps) {
	const history = useHistory();
	const { auth, signOut } = useAuth(selector);

	const handleAction = useCallback(
		(key: ReactText) => {
			if (key === 'status') {
				onStatusPress();
			} else if (key === 'reset') {
				onResetPress();
			} else if (key === 'logout') {
				void signOut();
			} else if (key === 'login' && history.location.pathname !== '/login') {
				history.push('/login');
			}
		},
		[history, onResetPress, onStatusPress, signOut]
	);

	return (
		<Menu onAction={handleAction} data-testid="telestionClientAvatarMenu">
			<Section title={auth ? `Hello ${auth.username}!` : `Sign in`}>
				<Item key="status">
					<InfoOutline size="S" />
					<Text data-testid="telestionClientAvatarMenu-item--status">
						Status
					</Text>
				</Item>
				<Item key="reset">
					<PagesExclude size="S" />
					<Text data-testid="telestionClientAvatarMenu-item--reset">
						Reset configuration
					</Text>
				</Item>
				{!auth ? (
					<Item key="login">
						<Login size="S" />
						<Text data-testid="telestionClientAvatarMenu-item--login">
							Login
						</Text>
					</Item>
				) : (
					<Item key="logout">
						<LogOut size="S" />
						<Text data-testid="telestionClientAvatarMenu-item--logout">
							Logout
						</Text>
					</Item>
				)}
			</Section>
		</Menu>
	);
}
