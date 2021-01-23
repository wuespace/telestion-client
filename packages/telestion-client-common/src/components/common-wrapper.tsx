import { ReactElement } from 'react';
import { StateSelector } from 'zustand';
import { defaultTheme, Provider, Flex } from '@adobe/react-spectrum';
import { Widget } from '@wuespace/telestion-client-types';

import { AppLogoContext } from './contexts/app-logo-context';
import { WidgetsContext } from './contexts/widgets-context';
import { ColorScheme, ColorSchemeState, useColorScheme } from '../hooks';

// color scheme selector
const selector: StateSelector<ColorSchemeState, ColorScheme> = ({
	colorScheme
}) => colorScheme;

export interface CommonWrapperProps {
	appLogo?: string;
	widgets?: Array<Widget>;
	children: ReactElement | ReactElement[];
}

export function CommonWrapper({
	appLogo,
	widgets,
	children
}: CommonWrapperProps) {
	const colorScheme = useColorScheme(selector);

	return (
		<Provider
			theme={defaultTheme}
			colorScheme={colorScheme !== 'system' ? colorScheme : undefined}
		>
			<AppLogoContext appLogo={appLogo}>
				<WidgetsContext widgets={widgets}>
					<Flex
						direction="column"
						height="100vh"
						justifyContent="start"
						alignItems="center"
					>
						{children}
					</Flex>
				</WidgetsContext>
			</AppLogoContext>
		</Provider>
	);
}
