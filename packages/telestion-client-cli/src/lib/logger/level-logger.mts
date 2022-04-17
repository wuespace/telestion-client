import { LogFunction } from '@fliegwerk/logsemts/build/types/LogFunction.js';

/**
 * Describes the log levels that the level logger can handle.
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'unknown';

/**
 * Maps a log level name to a log level priority number. (higher = more important)
 */
export const logLevels: Record<LogLevel, number> = {
	debug: 1,
	info: 2,
	warn: 3,
	error: 4,
	unknown: 1000
};

/**
 * Maps a log level priority number to a log level name.
 */
export const levelNames = (Object.keys(logLevels) as LogLevel[]).reduce<
	Record<number, LogLevel>
>((ret, key) => {
	ret[logLevels[key]] = key;
	return ret;
}, {});

let current: number = logLevels.error;

function isIn(level: string): boolean {
	switch (level.toLowerCase()) {
		case 'debug':
			return logLevels.debug >= current;
		case 'info':
			return logLevels.info >= current;
		case 'warn':
			return logLevels.warn >= current;
		case 'error':
			return logLevels.error >= current;
		default:
			return logLevels.unknown >= current;
	}
}

/**
 * Uses an existing log function to wrap a level logging system around.
 * Use {@link setLogLevel} to set the current log level.
 *
 * @param logger - the existing log function
 * @param initial - the initial log level (defaults to `'warn'`)
 * @returns the modified log function
 */
export function LevelLogger(
	logger: LogFunction,
	initial: LogLevel = 'warn'
): LogFunction {
	current = logLevels[initial];

	return (type, ...rest) => {
		if (isIn(type)) {
			logger(type, ...rest);
		}
	};
}

/**
 * Returns the current log level.
 */
export function getLogLevel(): LogLevel {
	return levelNames[current];
}

/**
 * Sets the current log level of the {@link LevelLogger}.
 * @param level - the new log level (one of:
 */
export function setLogLevel(level: LogLevel): void {
	current = logLevels[level] || 0; // display everything on unknown type
}
