import { useEffect, useState } from 'react';

/**
 * Throws an error after a timeout if any dependency is undefined.
 * @param dependencies dependencies to check for undefined
 * @param timeout timeout in seconds until the function throws, if 0 -> infinity
 * @throws if no data is received until timeout
 *
 * @example
 * const [position, setPosition] = useState<Pos>();
 *
 * // throws if no position received after 5 seconds
 * useDependencyTimeout(5, [position]);
 *
 * return <p>Latest position: {position}</p>;
 */
export default function useDependencyTimeout(
	timeout: number,
	dependencies: any[]
): boolean {
	const [isUndefined, setIsUndefined] = useState(true);
	const [error, setError] = useState<Error>();

	useEffect(() => {
		let id: any;
		if (timeout > 0 && isUndefined) {
			id = setTimeout(() => {
				setError(new Error('Timeout exceeded without any data'));
			}, timeout * 1000);
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
