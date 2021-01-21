import { ReactElement } from 'react';
import { defaultTheme, Provider, Flex } from '@adobe/react-spectrum';
import { AppLogoContext } from './contexts/app-logo-context';

export interface CommonWrapperProps {
	appLogo?: string;
	children: ReactElement | ReactElement[];
}

export function CommonWrapper({ appLogo, children }: CommonWrapperProps) {
	return (
		<Provider theme={defaultTheme} colorScheme="dark">
			<AppLogoContext appLogo={appLogo}>
				<Flex
					direction="column"
					height="100vh"
					justifyContent="start"
					alignItems="center"
				>
					{children}
				</Flex>
			</AppLogoContext>
		</Provider>
	);
}
