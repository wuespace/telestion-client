import User from '../model/User';
import userDashboards from './userDashboards';
import EventBus from 'vertx3-eventbus-client';

export default function authenticate(
	username: string,
	password: string,
	cb: (user: User | null) => void
) {
	// TODO: User validation
	console.log('Credentials', { username, password });
	const url = 'http://localhost:8081/bridge';
	// TODO: change user type
	const userType = 'admin';

	const eb = new EventBus(url);

	const user: User = {
		name: username,
		type: userType,
		eventBus: eb,
		dashboards: userDashboards[userType] || []
	};

	eb.onopen = () => {
		console.log('Eventbus opened');
		cb(user);
	};

	eb.onclose = () => {
		console.log('Eventbus closed');
	};
}
