import useAppState from './useAppState';

export default function useDarkColorScheme(): boolean {
	const [{ colorScheme }] = useAppState();

	switch (colorScheme) {
		case 'system':
			return matchMedia('(prefers-color-scheme: dark)').matches;
		case 'light':
			return false;
		case 'dark':
			return true;
	}
}
