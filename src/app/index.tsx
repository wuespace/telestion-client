import React from 'react';
import { defaultTheme, Provider } from '@adobe/react-spectrum';
import {
	BrowserRouter as Router,
	Switch,
	Redirect,
	Route
} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

export default function App() {
	return (
		<Provider theme={defaultTheme}>
			<Router>
				<Switch>
					<Route path={'/dashboard'}>
						<Dashboard />
					</Route>
					<Route path={'/login'}>
						<Login />
					</Route>
					<Route path={'/'}>
						<Redirect to="/login" />
					</Route>
				</Switch>
			</Router>
		</Provider>
	);
}
