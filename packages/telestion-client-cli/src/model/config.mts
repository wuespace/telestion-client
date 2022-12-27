import { Options } from 'electron-packager';

export type TelestionClientCLIConfig = Partial<
	Omit<Options, 'dir' | 'platform' | 'arch'> & {
		/**
		 * Whether the PSC should get packaged as an Electron app.
		 */
		electron: boolean;
	}
>;
