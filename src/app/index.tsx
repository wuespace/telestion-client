import React from 'react';
import { Provider, defaultTheme, Flex } from '@adobe/react-spectrum';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect
} from 'react-router-dom';

import HeaderPage from './pages/HeaderPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

import useAppState from '../hooks/useAppState';
import useConnectionStateBlinker from '../hooks/useConnectionStateBlinker';

export default function App() {
	const [state] = useAppState();
	const { user, colorScheme } = state;

	// TODO: REMOVE BEFORE PRODUCTION USE
	useConnectionStateBlinker();

	return (
		<Provider
			theme={defaultTheme}
			colorScheme={colorScheme === 'system' ? undefined : colorScheme}
		>
			<Flex
				direction="column"
				height="100vh"
				justifyContent="center"
				alignItems="center"
			>
				<Router>
					{user && <HeaderPage />}
					<Switch>
						<Route
							path="/"
							exact
							render={() => {
								return user ? <Redirect to="/dashboard" /> : <LoginPage />;
							}}
						/>
						<Route
							path="/dashboard/:id"
							render={() => {
								return user ? <DashboardPage /> : <Redirect to="/" />;
							}}
						/>
						<Route path="/dashboard">
							<Redirect to="/dashboard/0" />
						</Route>
						<Route path="/">
							<NotFoundPage />
						</Route>
					</Switch>
				</Router>
			</Flex>
		</Provider>
	);
}
