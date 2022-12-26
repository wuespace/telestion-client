import { lilconfigSync } from 'lilconfig';
import { getPSCRoot } from '../actions/psc.mjs';
import { Options } from 'electron-packager';
import { getLogger } from './logger/index.mjs';

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

export type TelestionClientCLIConfig = Partial<
	Omit<Options, 'dir' | 'platform' | 'arch'>
>;
