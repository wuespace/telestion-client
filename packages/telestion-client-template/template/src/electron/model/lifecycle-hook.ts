import { Plugin } from './plugin';

/**
 * A lifecycle hook is a function that is called when a lifecycle event occurs.
 */
export interface LifecycleHook {
	/**
	 * The name of the lifecycle hook.
	 *
	 * Used for logging purposes.
	 */
	readonly name: string;
	/**
	 * The function that is called when the lifecycle hook is executed.
	 * @param plugins the plugins that are currently loaded
	 */
	fn: (plugins: Plugin[]) => Promise<void> | void;
}
