import { useEffect, useState } from 'react';
import { isDefinedValue, Undefinable } from '../lib';

/**
 * Throws an error after a timeout if any dependency is undefined.
 * @param dependencies - the dependencies to check if they are undefined
 * @param timeout - the timeout in milliseconds until the function throws,
 * if it is 0 it waits indefinitely
 * @returns the current state of undefined dependencies
 *
 * @typeParam T - the tuple which represents the dependencies to check
 *
 * @throws Error - if some dependencies are undefined until timeout
 * and timeout is set
 *
 * @example
 * ```ts
 * const [position, setPosition] = useState<Position>();
 *
 * // throws if no position received after 5 seconds
 * if (useDependencyTimeout(5000, [position])) {
 * 	// type guarded - "position" is always defined
 * 	return <p>Latest position: {position}</p>;
 * }
 *
 * return <p>Waiting for incoming data</p>;
 * ```
 */
export function useDependencyTimeout<T extends readonly any[]>(
	// eslint-disable-next-line default-param-last
	timeout = 0,
	dependencies: [...Undefinable<T>]
): dependencies is [...T] {
	const [isDefined, setDefined] = useState(false);
	const [error, setError] = useState<Error>();

	useEffect(() => {
		let id: any;
		if (timeout > 0 && !isDefined) {
			id = setTimeout(() => {
				setError(new Error('Timeout exceeded without any data'));
			}, timeout);
		}

		return () => id && clearTimeout(id);
	}, [isDefined, timeout]);

	useEffect(
		() => setDefined(dependencies.every(isDefinedValue)),
		[...dependencies]
	);

	if (error) {
		throw error;
	}

	return isDefined;
}
