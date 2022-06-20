import { ReactElement } from 'react';
import { Flex, View } from '@adobe/react-spectrum';
import { Routing } from '@wuespace/telestion-client-types';
import { useBreakpoints } from '../../../hooks';

/**
 * React Props of {@link LoginPageProps}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link LoginPageProps}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface LoginPageProps {
	/**
	 * Components that the login page should render.
	 *
	 * Typical pre-defined components are:
	 * - {@link LoginTitle}
	 * - {@link LoginLogo}
	 * - {@link LoginDescription}
	 * - {@link LoginForm}
	 */
	children: ReactElement | Array<ReactElement>;
}

/**
 * A Telestion Client page that renders a login page
 * where the user typically enters their credentials
 * to log into the application.
 *
 * It only renders if nobody is authenticated.
 * Otherwise, it redirects to the dashboard page.
 *
 * It aligns its children vertically.
 *
 * Possible children components are:
 * - {@link LoginTitle}
 * - {@link LoginLogo}
 * - {@link LoginDescription}
 * - {@link LoginForm}
 *
 * * **Attention**
 *
 * If you create your own login page, please pass
 * the routing information so that the pages component read it
 * and render the page the right way:
 * `MyLoginPage.routing = TCLoginPage.routing;`
 *
 * @see {@Link LoginPageProps}
 * @see {@link LoginTitle}
 * @see {@link LoginLogo}
 * @see {@link LoginDescription}
 * @see {@link LoginForm}
 * @see {@link @wuespace/telestion-client-core#Pages}
 *
 * @example
 * ```ts
 * function MyLoginPage() {
 * 	return (
 * 		<LoginPage>
 * 			<LoginLogo />
 * 			<LoginTitle />
 * 			<LoginDescription />
 * 			<LoginForm initialServerURL="http://localhost:9870/bridge" />
 * 		</LoginPage>
 * 	);
 * }
 *
 * MyLoginPage.routing = TCLoginPage.routing;
 * ```
 */
export function LoginPage({ children }: LoginPageProps) {
	// const { isBase, isSm } = useBreakpoints();

	return (
		<Flex
			width="100%"
			height="100%"
			direction="column"
			justifyContent="center"
			alignItems="center"
		>
			<View overflow="auto" padding="size-100">
				<Flex direction="column" maxWidth="size-4600">
					{children}
				</Flex>
			</View>
		</Flex>
	);
}

/**
 * The routing for the login page of Telestion Client Common package.
 *
 * It only renders if nobody is authenticated.
 * Otherwise, it redirects to the dashboard page.
 */
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
