import { View, Image } from '@adobe/react-spectrum';
import { useLogo } from '../contexts/app-logo-context';

export function AppLogo() {
	const appLogo = useLogo();
	return (
		<View width="size-500" height="size-500">
			<Image src={appLogo} alt="Application Logo" objectFit="contain" />
		</View>
	);
}
