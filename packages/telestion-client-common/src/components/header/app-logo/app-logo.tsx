import { View, Image } from '@adobe/react-spectrum';
import { useLogo } from '../../contexts';
import { useAppLogoState } from './use-app-logo-state';
import { FixedOverlay } from './fixed-overlay';

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
	const { ref, isOpen, close } = useAppLogoState();
	const appLogo = useLogo();

	return (
		<View
			width="size-400"
			height="size-400"
			ref={ref}
			data-testid="telestionClientAppLogo"
		>
			<Image
				src={appLogo}
				alt="Application Logo"
				objectFit="contain"
				data-testid="telestionClientAppLogo-image"
			/>
			<FixedOverlay isOpen={isOpen} onClose={close} />
		</View>
	);
}
