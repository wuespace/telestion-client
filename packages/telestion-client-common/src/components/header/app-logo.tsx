import { View, Image } from '@adobe/react-spectrum';
import { useLogo } from '../contexts';

/**
 * Part of the Telestion Client Common header.
 *
 * It displays the current application logo fit inside the header component.
 * If no logo is specified in the {@link CommonWrapper}
 * the default Telestion Logo is used.
 *
 * @see {@link useLogo}
 * @see {@link Header}
 *
 * @example
 * ```ts
 * function AppHeader() {
 * 	return (
 * 		<Header
 *			left={<AppLogo />}
 * 		/>
 * 	);
 * }
 * ```
 */
export function AppLogo() {
	const appLogo = useLogo();
	return (
		<View width="size-400" height="size-400">
			<Image src={appLogo} alt="Application Logo" objectFit="contain" />
		</View>
	);
}
