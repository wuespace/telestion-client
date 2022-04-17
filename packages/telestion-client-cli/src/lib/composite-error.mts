/**
 * A generic error that has an error message and an additional payload.
 *
 * This error type can be used if you want to attach additional information to your error message.
 *
 * For example:
 * ```
 * try {
 *     await someMethodThatThrows();
 * } catch (err) {
 *     throw new CompositeError('Action xyz does not work', err);
 * }
 * ```
 */
export class CompositeError extends Error {
	private original: unknown;

	constructor(message: string, original: unknown) {
		super(message);
		this.name = 'CompositeError';
		this.original = original;
	}
}
