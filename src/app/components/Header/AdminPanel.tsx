import React from 'react';
import { useHistory } from 'react-router-dom';
import LogOut from '@spectrum-icons/workflow/LogOut';
import {
	ActionButton,
	Button,
	Flex,
	Text,
	StatusLight
} from '@adobe/react-spectrum';
import { SpectrumStatusLightProps } from '@react-types/statuslight';

import ColorScheme from '../../../model/ColorScheme';
import { changeColorScheme } from '../../../model/AppSettings';
import { clearAuthState } from '../../../model/AuthState';
import { ConnectionState } from '../../../model/Connection';

import ColorSchemeIcon from './ColorSchemeIcon';
import useAppSettings from '../../../hooks/useAppSettings';
import useAuthState from '../../../hooks/useAuthState';
import useConnection from '../../../hooks/useConnection';

const nextColorScheme: { [key in ColorScheme]: ColorScheme } = {
	system: 'light',
	light: 'dark',
	dark: 'system'
};

const statusLightVariant: {
	[key in ConnectionState]: SpectrumStatusLightProps['variant'];
} = {
	disconnected: 'negative',
	reconnecting: 'yellow',
	connected: 'positive'
};

const statusLightDesc: { [key in ConnectionState]: string } = {
	disconnected: 'Disconnected',
	reconnecting: 'Reconnecting',
	connected: 'Connected'
};

export default function AdminPanel() {
	const [{ colorScheme }, appDispatch] = useAppSettings();
	const [{ connectionState }] = useConnection();
	const [, authDispatch] = useAuthState();
	const history = useHistory();

	const handleColorSchemeChange = () => {
		appDispatch(changeColorScheme(nextColorScheme[colorScheme]));
	};

	const handleLogOut = () => {
		authDispatch(clearAuthState());
		// go to login page
		history.push('/');
	};

	return (
		<Flex
			direction="row"
			gap="size-100"
			justifyContent="center"
			alignItems="center"
		>
			<StatusLight variant={statusLightVariant[connectionState]}>
				{statusLightDesc[connectionState]}
			</StatusLight>
			<ActionButton
				aria-label={`Set colorscheme to ${colorScheme}`}
				onPress={handleColorSchemeChange}
			>
				<ColorSchemeIcon colorScheme={colorScheme} />
			</ActionButton>
			<Button variant="negative" onPress={handleLogOut}>
				<LogOut />
				<Text>Logout</Text>
			</Button>
		</Flex>
	);
}
