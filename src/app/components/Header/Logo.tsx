import React from 'react';
import { Flex, Image, Heading } from '@adobe/react-spectrum';
import logo from '../../media/logo.png';

export default function Logo() {
	return (
		<Flex
			direction="row"
			gap="size-100"
			justifyContent="center"
			alignItems="center"
		>
			<Image src={logo} alt="Daedalus 2 Logo" width="size-600" marginTop="size-50" />
			<Heading level={2}>Daedalus 2 GS</Heading>
		</Flex>
	);
}
