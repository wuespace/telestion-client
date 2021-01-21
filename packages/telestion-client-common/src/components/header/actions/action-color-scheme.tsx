import { useCallback } from 'react';
import { StateSelector } from 'zustand';
import { TooltipTrigger, Tooltip, ActionButton } from '@adobe/react-spectrum';
import shallow from 'zustand/shallow';

import Light from '@spectrum-icons/workflow/Light';
import Moon from '@spectrum-icons/workflow/Moon';
import LockClosed from '@spectrum-icons/workflow/LockClosed';

import {
	ColorScheme,
	ColorSchemeState,
	useColorScheme
} from '../../../hooks/stores/use-color-scheme';

const colorSchemeIcon: { [key in ColorScheme]: any } = {
	light: Light,
	dark: Moon,
	system: LockClosed
};

const colorSchemeTooltip: { [key in ColorScheme]: string } = {
	light: 'Change to dark mode',
	dark: 'Change to system default',
	system: 'Change to light mode'
};

const nextColorScheme: { [key in ColorScheme]: ColorScheme } = {
	light: 'dark',
	dark: 'system',
	system: 'light'
};

// color scheme selector
const selector: StateSelector<
	ColorSchemeState,
	{
		colorScheme: ColorSchemeState['colorScheme'];
		set: ColorSchemeState['set'];
	}
> = state => ({
	colorScheme: state.colorScheme,
	set: state.set
});

export function ActionColorScheme() {
	const { colorScheme, set } = useColorScheme(selector, shallow);
	const Icon = colorSchemeIcon[colorScheme];

	const handleChange = useCallback(() => set(nextColorScheme[colorScheme]), [
		colorScheme,
		set
	]);

	return (
		<TooltipTrigger>
			<ActionButton onPress={handleChange}>
				<Icon />
			</ActionButton>
			<Tooltip>{colorSchemeTooltip[colorScheme]}</Tooltip>
		</TooltipTrigger>
	);
}
