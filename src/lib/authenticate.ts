import Auth from '../model/Auth';

export default function authenticate(
	username: string,
	password: string,
	cb: (auth: Auth) => void
) {
	// TODO: User validation
	console.log('Credentials', { username, password });

	setTimeout(() => {
		console.log('Authentication successful');
		cb({
			username: 'admin',
			userType: 'full'
		});
	}, 2000);
}
