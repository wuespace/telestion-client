/**
 * A strategy to generate something in a tc-cli project.
 */
export interface GeneratorStrategy {
	/**
	 * The name of the generator strategy.
	 *
	 * Equality checks should be case-insensitive.
	 */
	readonly name: string;
	/**
	 * An alias for the generator strategy.
	 * Can be used to call the generator strategy.
	 *
	 * Usually the alias is the first letter of the {@link name}.
	 *
	 * Equality checks should be case-insensitive.
	 */
	readonly alias: string;

	/**
	 * Generates the files produced by this generator strategy.
	 * @param pscPath the path to the project root
	 * @param name the unprocessed name of the generated component
	 */
	generate(pscPath: string, name: string): Promise<void>;
}
