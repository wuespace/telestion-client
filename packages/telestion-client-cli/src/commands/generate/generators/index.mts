import { GeneratorStrategy } from './generator-strategy.mjs';
import { WidgetGenerator } from './widget-generator.mjs';

const generators: GeneratorStrategy[] = [new WidgetGenerator()];

/**
 * @returns names of all available generator strategies
 */
export function generatorNames() {
	return generators.map(generator => generator.name);
}

/**
 * Finds a generator strategy by its name or alias.
 *
 * Case-insensitive.
 * @param nameOrAlias the name or alias of the generator strategy
 * @return the generator strategy with the given name or alias
 */
export function findGenerator(nameOrAlias: string) {
	const generator = generators.find(whereNameOrAliasMatches(nameOrAlias));
	if (!generator) {
		throw new Error(`Generator "${nameOrAlias}" not found!`);
	}
	return generator;
}

/**
 * @returns a predicate that checks if the name or alias of a generator strategy
 * matches the given name or alias (case-insensitive).
 * @param nameOrAlias the name or alias to match
 */
function whereNameOrAliasMatches(nameOrAlias: string) {
	return (generator: GeneratorStrategy) =>
		generator.name.toLowerCase() === nameOrAlias.toLowerCase() ||
		generator.alias.toLowerCase() === nameOrAlias.toLowerCase();
}

export * from './generator-strategy.mjs';
export * from './widget-generator.mjs';
