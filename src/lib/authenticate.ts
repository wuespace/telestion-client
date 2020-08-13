import User from '../model/User';
import userDashboards from './userDashboards';

export default function authenticate(
	username: string,
	password: string,
	cb: (user: User | null) => void
) {
	// TODO: User validation
	console.log('Credentials', { username, password });

	setTimeout(() => {
		console.log('Authentication successful');
		// TODO: change user type
		const userType = 'admin';
		cb({
			name: username,
			type: userType,
			dashboards: userDashboards[userType] || []
		});
	}, 500);
}
