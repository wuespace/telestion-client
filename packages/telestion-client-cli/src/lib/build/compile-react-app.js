async function compileReactApp() {
	// Disable the PREFLIGHT_CHECK as react-scripts, otherwise, aborts warning about multiple webpack versions.
	process.env.SKIP_PREFLIGHT_CHECK = 'true';
	// Detect completion, based on log
	const originalConsoleLog = console.log;
	const promise = new Promise(resolve => {
		console.log = (...message) => {
			originalConsoleLog(...message);
			if (
				message[0] &&
				message[0].includes &&
				message[0].includes('Compiled successfully.')
			) {
				setTimeout(resolve, 250);
			}
		};
	});
	const { build } = require(`@craco/craco/lib/cra`);
	build({
		// Craco config
		reactScriptsVersion: 'react-scripts'
	});
	await promise;
	console.log = originalConsoleLog;
}

module.exports = compileReactApp;
