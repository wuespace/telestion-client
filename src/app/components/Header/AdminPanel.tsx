import React from 'react';
import LogOut from '@spectrum-icons/workflow/LogOut';
import {
	ActionButton,
	Button,
	Flex,
	Text,
	StatusLight
} from '@adobe/react-spectrum';
import { SpectrumStatusLightProps } from '@react-types/statuslight';
import { useHistory } from 'react-router-dom';

import ColorScheme from '../../../model/ColorScheme';
import { LOGOUT, SET_COLOR_SCHEME } from '../../../model/AppState';

import ColorSchemeIcon from './ColorSchemeIcon';
import useAppState from '../../../hooks/useAppState';
import ConnectionState from '../../../model/ConnectionState';

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
	const [{ colorScheme, connectionState }, dispatch] = useAppState();
	const history = useHistory();

	const handleColorSchemeChange = () => {
		dispatch({
			type: SET_COLOR_SCHEME,
			colorScheme: nextColorScheme[colorScheme]
		});
	};

	const handleLogOut = () => {
		dispatch({ type: LOGOUT });
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
