import { useEffect, useState } from 'react';

/**
 * Throws an error after a timeout if any dependency is undefined.
 * @param dependencies - the dependencies to check if they are undefined
 * @param timeout - the timeout in milliseconds until the function throws,
 * if it is 0 it waits indefinitely
 * @returns the current state of undefined dependencies
 *
 * @throws Error - if some dependencies are undefined until timeout
 * and timeout is set
 *
 * @example
 * ```ts
 * const [position, setPosition] = useState<Position>();
 *
 * // throws if no position received after 5 seconds
 * useDependencyTimeout(5, [position]);
 *
 * return <p>Latest position: {position}</p>;
 * ```
 */
export function useDependencyTimeout(
	timeout: number,
	dependencies: Array<any>
): boolean {
	const [isUndefined, setIsUndefined] = useState(true);
	const [error, setError] = useState<Error>();

	useEffect(() => {
		let id: any;
		if (timeout > 0 && isUndefined) {
			id = setTimeout(() => {
				setError(new Error('Timeout exceeded without any data'));
			}, timeout);
		}

		return () => {
			if (id) {
				clearTimeout(id);
			}
		};
	}, [isUndefined, timeout]);

	useEffect(() => {
		setIsUndefined(
			dependencies.some(dependency => typeof dependency === 'undefined')
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...dependencies]);

	if (error) {
		throw error;
	}

	return isUndefined;
}
