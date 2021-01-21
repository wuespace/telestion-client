import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import { Flex, Provider } from '@adobe/react-spectrum';

export interface ActionsProps {
	children: ReactElement | ReactElement[];
}

export function Actions({ children }: ActionsProps) {
	return (
		<Provider isQuiet>
			<Flex direction="row" gap="size-50">
				{children}
			</Flex>
		</Provider>
	);
}

Actions.propTypes = {
	children: PropTypes.node.isRequired
};
