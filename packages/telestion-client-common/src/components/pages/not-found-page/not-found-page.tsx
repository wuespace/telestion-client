import { Routing } from '@wuespace/telestion-client-types';
import { NotFoundMessage } from './not-found-message';

/**
 * A Telestion Client page that renders a fallback page
 * if the current route doesn't fit a page higher up in the list.
 * The component displays a _"not found"_ message and a button to return
 * to the dashboard page if the user is logged in.
 * Otherwise, the component redirects to the login page.
 *
 * It renders regardless if the user is authenticated or not.
 *
 * **Attention**
 *
 * If you create your own not found page, please pass
 * the routing information so that the pages component read it
 * and render the page the right way:
 * `MyNotFoundPage.routing = TCNotFoundPage.routing;`
 *
 * @see {@link @wuespace/telestion-client-core#Pages}
 *
 * @example
 * ```ts
 * function App() {
 * 	return (
 * 		<TelestionClient>
 * 			<Pages>
 * 				<LoginPage />
 * 				<DashboardPage />
 * 				<NotFoundPage />
 * 			</Pages>
 * 		</TelestionClient>
 * 	);
 * }
 * ```
 */
export function NotFoundPage() {
	return <NotFoundMessage />;
}

/**
 * The routing for the not found page of Telestion Client Common package.
 *
 * It renders regardless if someone is authenticated or not.
 */
const routing: Routing = {
	type: 'default',
	path: '/',
	exact: false
};

NotFoundPage.routing = routing;
