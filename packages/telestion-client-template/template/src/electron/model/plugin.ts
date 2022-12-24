/**
 * A plugin object containing lifecycle methods for the plugin.
 *
 * Gets managed by a {@link PluginManager}.
 */
export interface Plugin {
	/**
	 * A lifecycle method
	 */
	[hook: string]: ((...args: any) => any | Promise<any>) | undefined;
}
