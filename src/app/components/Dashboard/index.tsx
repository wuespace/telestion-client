import React, { useEffect } from 'react';
import useAppState from '../../../hooks/useAppState';
import { Flex, Heading, ProgressCircle } from '@adobe/react-spectrum';
import { LOGOUT } from '../../../model/AppState';
import { useHistory } from 'react-router-dom';

export default function Dashboard() {
	const history = useHistory();
	const [state, dispatch] = useAppState();
	const { auth, user } = state;

	useEffect(() => {
		if (!auth) dispatch({ type: LOGOUT });
		history.push('/');
	}, [auth, dispatch, history]);

	useEffect(() => {

	}, [user]);

	return user ? (
		<div>Dashboard</div>
	) : (
		<Flex gap="size-200">
			<ProgressCircle aria-label="Loading configuration…" isIndeterminate />
			<Heading level={2}>Loading configuration…</Heading>
		</Flex>
	);
}
