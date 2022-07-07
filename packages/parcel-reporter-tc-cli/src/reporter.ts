import { Reporter } from '@parcel/plugin';
import { JsonSerializable } from '@wuespace/telestion-client-types';

/**
 * The reporter sends every Parcel build status update through
 * Node's [IPC channel](https://nodejs.org/dist/latest-v16.x/docs/api/child_process.html#subprocesssendmessage-sendhandle-options-callback)
 * between two Node processes.
 *
 * The following build events are transmitted:
 * - `buildStart`
 * - `buildProgress` (with the build phase)
 * - `buildSuccess` (with the build time and number of bundles)
 * - `buildFailure` (with the failure diagnostics)
 *
 * Every other build event is ignored.
 */
export default new Reporter({
	report({ event, logger }) {
		let message: JsonSerializable;
		if (event.type === 'buildStart') {
			message = { type: 'buildStart' };
		} else if (event.type === 'buildProgress') {
			message = {
				type: 'buildProgress',
				phase: event.phase
			};
		} else if (event.type === 'buildSuccess') {
			message = {
				type: 'buildSuccess',
				buildTime: event.buildTime,
				numberOfBundles: event.bundleGraph.getBundles().length
			};
		} else if (event.type === 'buildFailure') {
			message = {
				type: 'buildFailure',
				diagnostics: event.diagnostics
			};
		} else {
			// unknown event type -> ignore it
			return;
		}

		if (process.send) {
			process.send(message);
		} else {
			logger.warn({
				message:
					"IPC to parent process is not open. Did you run Parcel through Node's fork process?"
			});
		}
	}
});
