import { Routing } from '@wuespace/telestion-client-types';
import { NotFoundMessage } from './not-found-message';

/**
 * A Telestion Client page that renders a fallback page
 * if the current route does not fit to a page higher up in the list.
 * It displays a "not found" message and a button to return
 * to the dashboard page if the some is authenticated.
 * Otherwise it returns to the login page.
 *
 * It renders always regardless if someone is authenticated or not.
 *
 * **Attention**
 *
 * If you create your own not found page, please pass through
 * the routing information so the pages component read it
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
 * It renders always regardless if someone is authenticated or not.
 */
const routing: Routing = {
	type: 'default',
	path: '/',
	exact: false
};

NotFoundPage.routing = routing;
