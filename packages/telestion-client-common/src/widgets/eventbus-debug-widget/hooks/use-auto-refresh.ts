import { useCallback, useEffect, useState } from 'react';

/**
 * Refreshs the component in a regular interval.
 * A refresh can immediately triggered if the returned function gets called.
 * @param refreshInterval - the interval to component should refresh
 *
 * @example
 * ```tsx
 * function MyComponent() {
 * 	const refresh = useAutoRefresh();
 *
 * 	return (
 * 		<div>
 * 			<button onClick={refresh}>Refresh</button>
 * 			<p>{mutatingObject.prop1}</p>
 * 		</div>
 * 	);
 * }
 * ```
 */
export function useAutoRefresh(refreshInterval = 2000): () => void {
	const [, setState] = useState<number>(0);

	useEffect(() => {
		const id = setInterval(
			() => setState(prevState => prevState + 1),
			refreshInterval
		);
		return () => clearInterval(id);
	}, [refreshInterval]);

	return useCallback(() => setState(prevState => prevState + 1), []);
}
