import { State } from 'zustand';

export type ColorScheme = 'light' | 'dark' | 'system';

export interface ColorSchemeState extends State {
	colorScheme: ColorScheme;

	set: (colorScheme: ColorScheme) => void;
}
