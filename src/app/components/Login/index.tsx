import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@adobe/react-spectrum';

export default function Login() {
	const history = useHistory();

	return (
		<div>
			Login
			<Button onPress={() => history.push('/dashboard')} variant={'cta'}>
				Login
			</Button>
		</div>
	);
}
