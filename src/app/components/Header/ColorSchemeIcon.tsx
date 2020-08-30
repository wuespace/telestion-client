import React from 'react';
import LockClosed from '@spectrum-icons/workflow/LockClosed';
import Light from '@spectrum-icons/workflow/Light';
import Moon from '@spectrum-icons/workflow/Moon';

import ColorScheme from '../../../model/appSettings/ColorScheme';

interface Props {
	colorScheme: ColorScheme;
}

export default function ColorSchemeIcon({ colorScheme }: Props) {
	switch (colorScheme) {
		case 'system':
			return <LockClosed />;
		case 'light':
			return <Light />;
		case 'dark':
			return <Moon />;
		default:
			throw new Error(`Unknown color scheme "${colorScheme}"`);
	}
}
