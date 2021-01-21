import create, { State, UseStore } from 'zustand';

export type ColorScheme = 'light' | 'dark' | 'system';

export interface ColorSchemeState extends State {
	colorScheme: ColorScheme;

	set: (colorScheme: ColorScheme) => void;
}

export const useColorScheme: UseStore<ColorSchemeState> = create<ColorSchemeState>(
	set => ({
		colorScheme: 'system',
		set: colorScheme => {
			set({ colorScheme });
		}
	})
);
