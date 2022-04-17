import { BaseOptions } from '../../model/index.mjs';

export interface CommandOptions extends BaseOptions {
	/**
	 * Required argument that is inherently set through the CLI.
	 */
	required: string;

	/**
	 * Optional argument that maybe not set through the CLI
	 * but should be "hydrated" through the hydrate function.
	 */
	optional: string;

	/**
	 * Some option value. (Maybe set, maybe not set)
	 */
	someProp: string;
}

/**
 * Default options for template command.
 */
export const defaultOptions: Partial<CommandOptions> = {
	someProp: 'defaultValue'
};
