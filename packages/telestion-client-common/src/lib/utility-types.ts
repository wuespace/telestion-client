/**
 * Makes the keys K from the interface S optional.
 *
 * @typeParam T - the interface the keys K to make some optional
 * @typeParam K - the union of keys from S to make optional
 *
 * @see {@link https://github.com/Microsoft/TypeScript/issues/25760}
 *
 * @example
 * ```ts
 * interface Foo {
 * 	foo: string;
 * 	bar: boolean;
 * 	baz: number;
 * }
 *
 * type FooWithOptional = Optional<Foo, 'foo' | 'bar'>;
 * ```
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * A state update for state type S with new parts of a state
 * or a function that receives the current state
 * and expects parts of a new state.
 *
 * _Following the React `SetStateAction` principle._
 *
 * @typeParam S - the full state type
 *
 * @see {@link react#SetStateAction}
 */
export type SetPartialStateAction<S> =
	| Partial<S>
	| ((prevState: S) => Partial<S>);

/**
 * Makes all elements in a tuple undefinable.
 * It adds the type `undefined` to possible type of every tuple element.
 *
 * @typeParam T - the tuple to extend its elements with undefined
 *
 * See {@link https://github.com/microsoft/TypeScript/pull/26063}
 * for more information.
 */
export type Undefinable<T extends readonly any[]> = {
	[P in keyof T]: T[P] | undefined;
};
