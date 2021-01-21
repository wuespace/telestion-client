import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import { Provider, View, Flex } from '@adobe/react-spectrum';

export interface HeaderProps {
	left?: ReactElement | ReactElement[];
	center?: ReactElement | ReactElement[];
	right?: ReactElement | ReactElement[];
}

export function Header({ left, center, right }: HeaderProps) {
	return (
		<Provider colorScheme="dark" width="100%">
			<View width="100%" height="size-700" backgroundColor="gray-200">
				<Flex direction="row" width="100%" height="100%" alignItems="center">
					<Flex
						flex={1}
						height="100%"
						marginStart="size-200"
						marginEnd="size-200"
						direction="row"
						alignItems="center"
						justifyContent="start"
						gap="size-200"
					>
						{left ?? <></>}
					</Flex>
				</Flex>

				<Flex
					flex={1}
					height="100%"
					marginStart="size-200"
					marginEnd="size-200"
					direction="row"
					alignItems="center"
					justifyContent="center"
					gap="size-200"
				>
					{center ?? <></>}
				</Flex>

				<Flex
					flex={1}
					height="100%"
					marginStart="size-200"
					marginEnd="size-200"
					direction="row"
					alignItems="center"
					justifyContent="end"
					gap="size-200"
				>
					{right ?? <></>}
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
