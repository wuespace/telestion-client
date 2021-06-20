import { ReactElement } from 'react';
import { StateSelector } from 'zustand';
import { defaultTheme, Provider, Flex } from '@adobe/react-spectrum';
import { Widget } from '@wuespace/telestion-client-types';

import { ColorScheme, ColorSchemeState, useColorScheme } from '../hooks';
import {
	ContextMenu,
	ContextMenuProvider,
	ContextMenuProviderProps
} from './context-menu';
import { AppLogoContext } from './contexts/app-logo-context';
import { WidgetsContext } from './contexts/widgets-context';

// color scheme selector
const selector: StateSelector<ColorSchemeState, ColorScheme> = ({
	colorScheme
}) => colorScheme;

// context menu renderer
const menu: ContextMenuProviderProps['menu'] = (
	sections,
	style,
	isOpen,
	close
) => (
	<ContextMenu
		sections={sections}
		style={style}
		isOpen={isOpen}
		onClose={close}
	/>
);

/**
 * React Props of {@link CommonWrapper}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link CommonWrapper}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface CommonWrapperProps {
	/**
	 * Path to a custom application logo that are used
	 * instead of the default Telestion logo.
	 */
	appLogo?: string;
	/**
	 * Registered widgets for the application to use.
	 */
	widgets?: Array<Widget>;
	/**
	 * The children received from the wrapper function of the "root" component
	 * {@link @wuespace/telestion-client-core#TelestionClient}.
	 */
	children: ReactElement | ReactElement[];
}

/**
 * The wrapper component of the Telestion Client Common library.
 *
 * It defines the basic display structure in form of a vertical flex element.
 *
 * @see {@link CommonWrapperProps}
 *
 * @example
 * ```ts
 * const widgets: Array<Widget> = [
 * 	...commonWidgets,
 * 	...projectWidgets
 * ];
 *
 * function App() {
 * 	return (
 * 		<TelestionClient
 * 			wrapper={children => (
 * 			  <CommonWrapper widgets={widgets}>
 * 			  	{children}
 * 			 	</CommonWrapper>
 * 			)}
 * 		>
 * 			<Pages>
 * 				...
 * 			</Pages>
 * 		</TelestionClient>
 * 	);
 * }
 * ```
 */
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
			<ContextMenuProvider menu={menu}>
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
			</ContextMenuProvider>
		</Provider>
	);
}
