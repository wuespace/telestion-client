import React, { useCallback } from 'react';
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
import { ConnectionState } from '../../../model/Connection';

import ColorSchemeIcon from './ColorSchemeIcon';
import useAppSettings from '../../../hooks/useAppSettings';
import useAuthState from '../../../hooks/useAuthState';
import useConnection from '../../../hooks/useConnection';
import { clearCredentials } from '../../../model/AuthState';

const nextColorScheme: { [key in ColorScheme]: ColorScheme } = {
	system: 'light',
	light: 'dark',
	dark: 'system'
};

const statusLightVariant: {
	[key in ConnectionState]: SpectrumStatusLightProps['variant'];
} = {
	disconnected: 'negative',
	connected: 'positive',
	error: 'yellow'
};

const statusLightDesc: { [key in ConnectionState]: string } = {
	disconnected: 'Disconnected',
	connected: 'Connected',
	error: 'Error in Communication'
};

export default function AdminPanel() {
	const [{ colorScheme }, appDispatch] = useAppSettings();
	const [, authDispatch] = useAuthState();
	const [{ connectionState }] = useConnection();
	const history = useHistory();

	const handleColorSchemeChange = useCallback(() => {
		appDispatch(changeColorScheme(nextColorScheme[colorScheme]));
	}, [appDispatch, colorScheme]);

	const handleLogout = useCallback(() => {
		authDispatch(clearCredentials());
		// go to login page
		history.push('/');
	}, [authDispatch, history]);

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
			<Button variant="negative" onPress={handleLogout}>
				<LogOut />
				<Text>Logout</Text>
			</Button>
		</Flex>
	);
}
