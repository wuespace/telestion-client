import React from 'react';
import ReactDOM from 'react-dom';

import { appSettingsReducer } from './model/appSettings/AppSettings';
import { authStateReducer } from './model/authState/AuthState';
import { connectionReducer } from './model/connection/Connection';
import defaultAppSettings from './model/appSettings/defaultAppSettings';
import initialAuthState from './model/authState/initialAuthState';
import initialConnection from './model/connection/initialConnection';

import './styles.scss';
import * as serviceWorker from './serviceWorker';

import App from './app';
import AppSettingsProvider from './app/components/Provider/AppSettingsProvider';
import AuthStateProvider from './app/components/Provider/AuthStateProvider';
import ConnectionProvider from './app/components/Provider/ConnectionProvider';

ReactDOM.render(
	<React.StrictMode>
		{/* use debug prop to show prev state, action and next state */}
		<AppSettingsProvider
			defaultState={defaultAppSettings}
			reducer={appSettingsReducer}
			debug
		>
			<AuthStateProvider
				initialAuthState={initialAuthState}
				reducer={authStateReducer}
				debug
			>
				<ConnectionProvider
					initialConnection={initialConnection}
					reducer={connectionReducer}
					debug
				>
					<App />
				</ConnectionProvider>
			</AuthStateProvider>
		</AppSettingsProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
