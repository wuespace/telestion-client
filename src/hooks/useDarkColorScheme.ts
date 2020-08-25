import useAppSettings from './useAppSettings';

export default function useDarkColorScheme(): boolean {
	const [{ colorScheme }] = useAppSettings();

	switch (colorScheme) {
		case 'system':
			return matchMedia('(prefers-color-scheme: dark)').matches;
		case 'light':
			return false;
		case 'dark':
			return true;
	}
}
