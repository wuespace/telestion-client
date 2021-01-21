import { createContext, ReactElement, useContext } from 'react';
import PropTypes from 'prop-types';
import defaultAppLogo from '../../media/default-app-logo.png';

const appLogoContext = createContext<string | null>(null);

export interface AppLogoContextProps {
	appLogo?: string;

	children: ReactElement | Array<ReactElement>;
}

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

export function useLogo(): string {
	const appLogo = useContext(appLogoContext);
	if (!appLogo) {
		throw new TypeError(
			'Not in an AppLogo context. Please provide one to continue.'
		);
	}
	return appLogo;
}
