import ReactDOM from 'react-dom';

import { App } from './components/app';
import './index.css';

if (window.environment) {
	console.log('Current platform:', window.environment.platform);
	console.log('Current architecture:', window.environment.arch);
	console.log('Current Chrome version:', window.environment.chrome);
	console.log('Current Electron version:', window.environment.electron);
	console.log('Current Node version:', window.environment.node);
	console.log(
		'Creation Time:',
		window.environment.creationTime
			? new Date(window.environment.creationTime)
			: undefined
	);
	console.log('Project version:', window.environment.version);
} else {
	console.log('Not running inside Electron container');
}

ReactDOM.render(<App />, document.getElementById('root'));
