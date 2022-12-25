import { BaseOptions } from '../../model/index.mjs';

export interface GenerateOptions extends BaseOptions {
	generator: string;

	name: string;
}
