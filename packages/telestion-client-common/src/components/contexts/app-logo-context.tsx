import { createContext, ReactElement, useContext } from 'react';
import PropTypes from 'prop-types';
import defaultAppLogo from '../../media/default-app-logo.svg';

// React context for the path to the application logo
const appLogoContext = createContext<string | null>(null);

/**
 * React Props of {@link AppLogoContext}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link AppLogoContext}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface AppLogoContextProps {
	/**
	 * An optional path to the application logo.
	 * If no path is given the default Telestion logo applies.
	 */
	appLogo?: string;

	/**
	 * The children components which have access to the application logo context
	 * via the {@link useLogo} hook.
	 */
	children: ReactElement | Array<ReactElement>;
}

/**
 * Wraps its children into the application logo context
 * which stores the path to the application logo
 * and is accessible via the {@link useLogo} hook.
 *
 * @see {@link useLogo}
 * @see {@link AppLogoContextProps}
 *
 * @example
 * ```ts
 * interface Props {
 * 	appLogo?: string;
 * 	children: ReactElement | Array<ReactElement>;
 * }
 *
 * function MyWrapper({ appLogo, children }: Props) {
 * 	return (
 * 		<AppLogoContext appLogo={appLogo}>
 * 			{children}
 * 		</AppLogoContext>
 * 	);
 * }
 * ```
 */
export function AppLogoContext({ appLogo, children }: AppLogoContextProps) {
	return (
		<appLogoContext.Provider value={appLogo ?? defaultAppLogo}>
			{children}
		</appLogoContext.Provider>
	);
}

AppLogoContext.propTypes = {
	appLogo: PropTypes.string,
	children: PropTypes.node.isRequired
};

/**
 * Returns the path to the current application logo.
 * It can be replaced by a custom logo in the {@link CommonWrapper} component.
 *
 * @throws TypeError - if called outside of the {@link CommonWrapper}
 *
 * @see {@link AppLogoContext}
 * @see {@link CommonWrapper}
 *
 * @example
 * ```ts
 * function AppLogo() {
 * 	const appLogo = useLogo();
 * 	return <Image src={appLogo} alt="Application logo" />;
 * }
 * ```
 */
export function useLogo(): string {
	const appLogo = useContext(appLogoContext);
	if (!appLogo) {
		throw new TypeError(
			'Not in an AppLogo context. Please provide one to continue.'
		);
	}
	return appLogo;
}
