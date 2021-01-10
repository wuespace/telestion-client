import { getLogger } from '../lib/logger';

/**
 * Returns a component logger for a specific system.
 *
 * In the background it uses logsemts.
 * For a better understanding, please take a look at their
 * {@link https://github.com/fliegwerk/logsemts | GitHub page}.
 *
 * @param system - the system or component the logger is for
 * @returns the component logger for the specified system
 *
 * @see {@link logsemts#ComponentLogger}
 * @see {@link https://github.com/fliegwerk/logsemts}
 *
 * @example
 * ```ts
 * export function MyComponent(): ReactNode {
 * 	const logger = useLogger('My Component');
 *
 * 	return (
 * 		<button onClick={() => logger.info('Button clicked')}>
 * 			Click Me!
 * 		</button>;
 * }
 * ```
 */
export function useLogger(system: string): ReturnType<typeof getLogger> {
	return getLogger(system);
}
