import create, { UseStore } from 'zustand';
import { ColorSchemeState } from './use-color-scheme.model';

export const useColorScheme: UseStore<ColorSchemeState> = create<ColorSchemeState>(
	set => ({
		colorScheme: 'system',
		set: colorScheme => {
			set({ colorScheme });
		}
	})
);
