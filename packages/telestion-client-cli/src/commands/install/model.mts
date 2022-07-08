import { BaseOptions } from '../../model/index.mjs';

export type DependencyType = 'prod' | 'dev' | 'electron';

export interface InstallOptions extends BaseOptions {}

/**
 * Default options for template command.
 */
export const defaultInstallOptions: Partial<InstallOptions> = {};
