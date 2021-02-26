import { BrowserLogger, ComponentLogger, Logger } from '@fliegwerk/logsemts';

const logger = new Logger({
	loggers: [BrowserLogger()]
});

/**
 * Builds and returns a component logger for a specific system.
 * @param system - the system or component the logger is for
 * @returns the component logger for the specified system
 *
 * @example
 * ```ts
 * const logger = getLogger('My Component');
 *
 * logger.log('I am a log message');
 * logger.success('I am a success message');
 * logger.warn('I am a warning message');
 * ```
 */
export function getLogger(system: string): ComponentLogger {
	return logger.getComponentLogger(system);
}
