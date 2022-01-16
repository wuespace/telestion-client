/**
 * Compiles the React app.
 *
 * Uses the "native" `react-scripts build` behavior => Exits the process if an error occurs
 * @return {Promise<void>} resolves when the app is compiled
 */
async function compileReactApp() {
	// Disable the PREFLIGHT_CHECK as react-scripts, otherwise, aborts warning about multiple webpack versions.
	process.env.SKIP_PREFLIGHT_CHECK = 'true';
	// craco, in the background, imports (and runs) the `react-scripts build` script.
	// Unfortunately, that script runs asynchronously and there's no nice way to detect completion.
	// To run tasks after compiling the React app in the right order, we therefore inject `console.log`
	// with a custom function. If `react-scripts` logs "Compiled successfully.", we know that the compilation is complete.
	const originalConsoleLog = console.log;
	/**
	 * A promise that resolves when the injected `console.log` function got called with `'Compiled successfully.'`
	 * @type {Promise<void>}
	 */
	const promise = new Promise(resolve => {
		console.log = (...message) => {
			originalConsoleLog(...message); // log the content to the actual console, as well

			if (
				message[0] &&
				message[0].includes &&
				/Compiled .*\./.test(message[0]) // 'Compiled successfully.' or 'Compiled with warnings.'
			) {
				// Set a timeout to allow for final messages to get printed before continuing
				// while 'Compiled successfully.' / 'Compiled with warnings.' is the string that easiest to 
				// detect, a few lines follow it in the log.
				setTimeout(resolve, 250);
			}
		};
	});

	// `build`, internally, overrides the require-cache to inject a custom config into `react-scripts`.
	// Then, it just imports (and thus, runs) the `react-scripts build` script.
	const { build } = require(`@craco/craco/lib/cra`);
	build({
		// craco config
		reactScriptsVersion: 'react-scripts'
	});
	await promise; // await completion of the build step

	// reset `console.log` override:
	console.log = originalConsoleLog;
}

module.exports = compileReactApp;
