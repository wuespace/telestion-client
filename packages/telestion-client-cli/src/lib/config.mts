import { lilconfigSync } from 'lilconfig';
import { getPSCRoot } from '../actions/psc.mjs';
import { getLogger } from './logger/index.mjs';
import { TelestionClientCLIConfig } from '../model/index.mjs';

let cache: TelestionClientCLIConfig | undefined;

export async function getPSCConfig(): Promise<TelestionClientCLIConfig> {
	if (cache) return cache;

	let pscRoot = await getPSCRoot(process.cwd());
	const config = lilconfigSync('telestion', {
		stopDir: pscRoot
	}).search(pscRoot);

	let loadedConfig = config?.config ?? {};
	getLogger('Config').debug('Loaded config:', loadedConfig);
	cache = loadedConfig;
	return loadedConfig;
}
