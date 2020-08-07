import React from 'react';
import ReactDOM from 'react-dom';

import './styles.scss';
import * as serviceWorker from './serviceWorker';
import App from './app';

import AppStateProvider from './app/components/AppStateProvider';
import initialAppState from './lib/initialAppState';
import appReducer from './lib/appReducer';

ReactDOM.render(
	<React.StrictMode>
		{/* use debug prop to show prev state, action and next state */}
		<AppStateProvider initialAppState={initialAppState} reducer={appReducer}>
			<App />
		</AppStateProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
