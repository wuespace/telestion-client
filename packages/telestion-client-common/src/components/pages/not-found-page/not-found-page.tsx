import { Routing } from '@wuespace/telestion-client-types';
import { NotFoundMessage } from './not-found-message';

export function NotFoundPage() {
	return <NotFoundMessage />;
}

const routing: Routing = {
	type: 'default',
	path: '/',
	exact: false
};

NotFoundPage.routing = routing;
