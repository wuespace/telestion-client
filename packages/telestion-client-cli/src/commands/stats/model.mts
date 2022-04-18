import { BaseOptions } from '../../model/index.mjs';

export interface StatsOptions extends BaseOptions {
	json: boolean;
}

/**
 * Default options for template command.
 */
export const defaultOptions: Partial<StatsOptions> = {
	json: false
};
