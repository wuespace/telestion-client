import { Flex } from '@adobe/react-spectrum';
import { Routing } from '@wuespace/telestion-client-types';
import { Login } from './login';

export function LoginPage() {
	return (
		<Flex direction="column" justifyContent="center" alignItems="center">
			<Login />
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
