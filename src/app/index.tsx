import React from 'react';
import { Provider, defaultTheme, Flex } from '@adobe/react-spectrum';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

import useAppSettings from '../hooks/useAppSettings';
import useAuthState from '../hooks/useAuthState';
import useConnectionManager from '../hooks/useConnectionManager';

export default function App() {
	const [{ colorScheme }] = useAppSettings();
	const [{ credentials }] = useAuthState();

	// synchronises the connection context to the auth state
	useConnectionManager();

	return (
		<Provider
			theme={defaultTheme}
			colorScheme={colorScheme === 'system' ? undefined : colorScheme}
			defaultColorScheme="dark"
		>
			<Flex
				direction="column"
				height="100vh"
				justifyContent="center"
				alignItems="center"
			>
				<Router>
					<Switch>
						<Route
							path="/"
							exact
							render={() => {
								return credentials ? (
									<Redirect to="/dashboard" />
								) : (
									<LoginPage />
								);
							}}
						/>
						<Route
							path="/dashboard/:id"
							render={() => {
								return credentials ? <DashboardPage /> : <Redirect to="/" />;
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
