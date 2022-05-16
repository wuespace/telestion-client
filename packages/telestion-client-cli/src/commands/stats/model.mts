import { BaseOptions } from '../../model/index.mjs';

export interface StatsOptions extends BaseOptions {
	/**
	 * Output the statistics as JSON.
	 */
	json: boolean;
}

/**
 * Default options for template command.
 */
export const defaultStatsOptions: Partial<StatsOptions> = {
	json: false
};
