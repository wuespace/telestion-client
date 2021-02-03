import { Image } from '@adobe/react-spectrum';
import { useLogo } from '../../contexts/app-logo-context';

export function LoginLogo() {
	const appLogo = useLogo();

	return (
		<Image
			src={appLogo}
			alignSelf="center"
			alt="Application logo"
			width="size-1200"
			height="size-1200"
		/>
	);
}
