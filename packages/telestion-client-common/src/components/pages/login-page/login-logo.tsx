import { Image } from '@adobe/react-spectrum';
import { useLogo } from '../../contexts';
import { useBreakpoints } from '../../../hooks/abstractions/use-breakpoints';

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
 * 			<LoginLogo />
 * 			<LoginTitle />
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
	const { isBase, isSm } = useBreakpoints();

	return (
		<Image
			src={appLogo}
			alignSelf="center"
			alt="Application logo"
			width={`${isBase || isSm ? 'size-200' : 'size-1200'}`}
			height={`${isBase || isSm ? 'size-200' : 'size-1200'}`}
		/>
	);
}
