import { Heading } from '@adobe/react-spectrum';
import { useTitle } from '@wuespace/telestion-client-core';

/**
 * The login title component that renders the current application title
 * in the login page.
 *
 * This component belongs to the {@link LoginPage}
 *
 * @see {@link LoginPage}
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
export function LoginTitle() {
	const title = useTitle();
	return (
		<Heading level={2}>
			{typeof title === 'string' ? title : 'Invalid type'}
		</Heading>
	);
}
