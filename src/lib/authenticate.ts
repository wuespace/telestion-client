import User from '../model/User';
import userDashboards from './userDashboards';
import EventBus from 'vertx3-eventbus-client';

export default async function authenticate(
	username: string,
	password: string,
	serverUrl: string
): Promise<User> {
	return new Promise((resolve, reject) => {
		// TODO: User validation
		console.log('Credentials', {
			username,
			password: password
				.split('')
				.map(() => '*')
				.join(''),
			serverUrl
		});
		// TODO: change user type
		const userType = 'admin';

		const eb = new EventBus(serverUrl);

		const user: User = {
			name: username,
			type: userType,
			eventBus: eb,
			dashboards: userDashboards[userType] || []
		};

		eb.onopen = () => {
			console.log('Eventbus opened');
			resolve(user);
		};

		eb.onclose = () => {
			console.log('Eventbus closed');
			reject(
				'Cannot connect to backend server. Is the server address correct?'
			);
		};

		eb.onerror = error => {
			reject(error);
		};
	});
}
