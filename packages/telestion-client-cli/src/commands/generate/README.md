# Generate command

## Generator

A generator is a recipe for generating a type of component (usually containing 1..n files).

To keep this easy to extend with new generators, we use a strategy pattern. Generators are objects that implement the `GeneratorStrategy` interface.

## `generators` folder

The `generators` folder contains:

1. files containing generator classes for all supported generators
2. an `index.mts` file that exports all generators and functions mapping generator names to generator classes
3. `generator-strategy.mts` that contains the `GeneratorStrategy` interface that has to be implemented by all generators
