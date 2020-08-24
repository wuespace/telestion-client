import Dashboard from './Dashboard';
import { EventBus } from 'vertx3-eventbus-client';

export default interface User {
	name: string;
	type: string;
	eventBus: EventBus;
	dashboards: Array<Dashboard>;
}
