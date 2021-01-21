import { Routing } from '@wuespace/telestion-client-types';
import { Login } from './login';

export function LoginPage() {
	return <Login />;
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
