import { Plugin } from './model/plugin';
import { LifecycleHook } from './model/lifecycle-hook';
import { Awaitable } from './model/awaitable';

/**
 * The plugin manager is responsible for loading and managing plugins.
 *
 * It can be used to load plugins, and to execute lifecycle hooks.
 *
 * @see {@link LifecycleHook}, {@link Plugin}
 */
export class PluginManager {
	/**
	 * The plugins that are currently installed.
	 * @private
	 */
	private plugins: Plugin[] = [];
	/**
	 * A promise that resolves when all plugins are installed.
	 * @private
	 */
	private _ready: Promise<any> = Promise.resolve();

	/**
	 * Creates a new plugin manager.
	 * @param plugins the plugins to initially load
	 */
	constructor(plugins: Awaitable<Plugin>[]) {
		plugins.forEach(plugin => this.installPlugin(plugin));
	}

	/**
	 * Installs a plugin.
	 *
	 * Installation is done in the background, so the plugin is not immediately available.
	 * However, it is guaranteed that the plugin is installed before the next lifecycle hook is called.
	 * @param plugin the plugin to install
	 */
	installPlugin(plugin: Plugin | Promise<Plugin>): void {
		this._ready = Promise.allSettled([
			this._ready,
			this.validateAndAddPlugin(plugin)
		]);
	}

	/**
	 * Executes a lifecycle hook.
	 *
	 * This method is asynchronous and returns a promise that resolves when all plugins have executed the hook.
	 *
	 * Awaits any pending plugin installation completions.
	 * @param hook the lifecycle hook to execute
	 */
	async callHook(hook: LifecycleHook) {
		await this._ready;
		await hook.fn(this.plugins);
	}

	/**
	 * Checks if the given object is a valid plugin.
	 * @param plugin the object to check
	 * @private
	 */
	private isPlugin(plugin: unknown): plugin is Plugin {
		return (
			typeof plugin === 'object' &&
			plugin !== null &&
			!Array.isArray(plugin) &&
			!(plugin instanceof Promise)
		);
	}

	/**
	 * Validates and adds a plugin to the list of installed plugins if it is a valid plugin.
	 * Rejects the promise if the plugin is not valid.
	 * @param plugin the plugin to validate and add
	 * @private
	 */
	private async validateAndAddPlugin(plugin: Plugin | Promise<Plugin>) {
		const pluginInstance = await plugin;
		if (!this.isPlugin(pluginInstance)) {
			throw new Error('Plugin is not a valid plugin: ' + pluginInstance);
		}
		this.plugins.push(pluginInstance);
	}
}
