import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import { Provider, View, Flex } from '@adobe/react-spectrum';
import { useBreakpoints } from '../../hooks/abstractions/use-breakpoints';

/**
 * React Props of {@link Header}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link Header}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface HeaderProps {
	/**
	 * Header components aligned on the left side of the header.
	 */
	left?: ReactElement | ReactElement[];

	/**
	 * Header components aligned in the center of the header.
	 */
	center?: ReactElement | ReactElement[];

	/**
	 * Header components aligned on the right side of the header.
	 */
	right?: ReactElement | ReactElement[];
}

/**
 * The Header component of Telestion Client Common.
 *
 * It displays a header in style of the Adobe Spectrum header pattern.
 * Components of the header can be left, center or right aligned.
 *
 * @see {@link https://spectrum.adobe.com/page/headers/}
 * @see {@link HeaderProps}
 * @see {@link AppLogo}
 * @see {@link NavBar}
 * @see {@link DashboardPicker}
 * @see {@link ConnectionIndicator}
 * @see {@link Actions}
 * @see {@link ColorSchemeAction}
 * @see {@link AccountControls}
 *
 * @example
 * ```ts
 * function AppHeader() {
 * 	return (
 * 		<Header
 * 			left={
 * 				<>
 * 					<AppLogo />
 * 					<NavBar />
 * 				</>
 * 			}
 * 			center={<DashboardPicker>}
 * 			right={
 * 				<>
 * 					<ConnectionIndicator />
 * 					<Actions>
 * 					  <ColorSchemeAction />
 * 					</Actions>
 * 					<AccountControls />
 * 				</>
 * 			}
 * 		/>
 * 	);
 * }
 * ```
 */
export function Header({ left, center, right }: HeaderProps) {
	const { isBase, isSm } = useBreakpoints();

	return (
		<Provider flex={0} width="100%" colorScheme="dark" isQuiet>
			<View width="100%" height="size-600" backgroundColor="gray-200">
				<Flex direction="row" width="100%" height="100%" alignItems="center">
					<Flex
						flex={`${isBase || isSm ? '0 1' : 1}`}
						height="100%"
						marginStart={`${isBase || isSm ? 'size-100' : 'size-200'}`}
						marginEnd={`${isBase || isSm ? 'size-100' : 'size-200'}`}
						direction="row"
						alignItems="center"
						justifyContent="start"
						gap="size-200"
					>
						{/* eslint-disable-next-line react/jsx-no-useless-fragment */}
						{left ?? <></>}
					</Flex>

					<Flex
						flex={1}
						height="100%"
						marginStart={`${isBase || isSm ? 'size-100' : 'size-200'}`}
						marginEnd={`${isBase || isSm ? 'size-100' : 'size-200'}`}
						direction="row"
						alignItems="center"
						justifyContent={`${isBase || isSm ? 'start' : 'center'}`}
						gap={`${isBase || isSm ? 'size-50' : 'size-200'}`}
					>
						{/* eslint-disable-next-line react/jsx-no-useless-fragment */}
						{center ?? <></>}
					</Flex>

					<Flex
						flex={1}
						height="100%"
						marginStart={`${isBase || isSm ? 'size-100' : 'size-200'}`}
						marginEnd={`${isBase || isSm ? 'size-100' : 'size-200'}`}
						direction="row"
						alignItems="center"
						justifyContent="end"
						gap={`${isBase || isSm ? 'size-50' : 'size-200'}`}
					>
						{/* eslint-disable-next-line react/jsx-no-useless-fragment */}
						{right ?? <></>}
					</Flex>
				</Flex>
			</View>
		</Provider>
	);
}

Header.propTypes = {
	left: PropTypes.node,
	center: PropTypes.node,
	right: PropTypes.node
};
