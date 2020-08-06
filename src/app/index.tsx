import React, { useState } from 'react';
import { Provider, defaultTheme, Flex } from '@adobe/react-spectrum';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ColorScheme } from '@react-types/provider';

import LoginPage from './containers/LoginPage';
import DashboardPage from './containers/DashboardPage';

export default function App() {
	// TODO: Add selection for color scheme
	const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');

	return (
		<Provider theme={defaultTheme} colorScheme={colorScheme}>
			<Flex
				direction="column"
				height="100vh"
				justifyContent="center"
				alignItems="center"
			>
				<Router>
					<Switch>
						<Route path="/" exact component={LoginPage} />
						<Route path="/dashboard" component={DashboardPage} />
					</Switch>
				</Router>
			</Flex>
		</Provider>
	);
}
