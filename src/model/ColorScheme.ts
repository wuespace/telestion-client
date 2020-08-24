import { ColorScheme as SpectrumColorScheme } from '@react-types/provider';

type ColorScheme = SpectrumColorScheme | 'system';

export default ColorScheme;

export const validColorSchemes: ColorScheme[] = [
	'system',
	'light',
	'dark'
];
