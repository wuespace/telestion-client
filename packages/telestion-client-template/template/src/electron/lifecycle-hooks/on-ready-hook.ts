import { LifecycleHook } from '../model/lifecycle-hook';
import { Plugin } from '../model/plugin';

export class OnReadyHook implements LifecycleHook {
	readonly name = 'onReady';

	async fn(plugins: Array<Plugin>) {
		await Promise.allSettled(plugins.map(this.callOnReadyHook));
	}

	private async callOnReadyHook(plugin: Plugin) {
		if (!plugin.onReady || typeof plugin.onReady !== 'function') {
			return;
		}
		await plugin.onReady();
	}
}
