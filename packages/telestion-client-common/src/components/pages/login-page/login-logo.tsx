import { Image } from '@adobe/react-spectrum';
import { useLogo } from '../../contexts';

/**
 * The login logo component that renders the current application logo
 * in the login page.
 *
 * This component belongs to the {@link LoginPage}
 *
 * @see {@link LoginPage}
 *
 * @example
 * ```ts
 * function MyLoginPage() {
 * 	return (
 * 		<LoginPage>
 * 			<LoginTitle />
 * 			<LoginLogo />
 * 			<LoginDescription />
 * 			<LoginForm initialServerURL="http://localhost:9870/bridge" />
 * 		</LoginPage>
 * 	);
 * }
 *
 * MyLoginPage.routing = TCLoginPage.routing;
 * ```
 */
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
