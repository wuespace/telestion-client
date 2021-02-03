import { Flex } from '@adobe/react-spectrum';
import { Routing } from '@wuespace/telestion-client-types';
import { ReactElement } from 'react';

export interface LoginPageProps {
	children: ReactElement | Array<ReactElement>;
}

export function LoginPage({ children }: LoginPageProps) {
	return (
		<Flex
			width="100%"
			height="100%"
			direction="column"
			justifyContent="center"
			alignItems="center"
		>
			<Flex direction="column" maxWidth="size-4600">
				{children}
			</Flex>
		</Flex>
	);
}

const routing: Routing = {
	type: 'unAuth',
	path: '/login',
	redirectPath: '/dashboard',
	exact: false,
	additionalRedirects: [
		// redirect application to login page on load
		{
			path: '/',
			exact: true,
			redirectPath: '/login',
			last: false
		}
	]
};

LoginPage.routing = routing;
